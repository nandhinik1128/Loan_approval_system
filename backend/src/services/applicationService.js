import { getDocumentCatalog, getLoanRule, flattenDocuments } from '../data/loanRules.js';
import { calculateDebtToIncome, calculateRiskScore, getEligibilityFlags } from '../utils/scores.js';
import { calculateEmi } from '../utils/emi.js';
import { buildDocumentChecklist, summarizeChecklist } from './validationService.js';
import { createApplication, findApplicationById, listApplications, updateApplication } from './store.js';

function buildFilesByField(files = []) {
  return files.reduce((accumulator, file) => {
    accumulator[file.fieldname] = file;
    return accumulator;
  }, {});
}

export function generateDocumentRequirements({ loanType, employmentType }) {
  const catalog = getDocumentCatalog(loanType, employmentType);
  return {
    loanType,
    employmentType,
    loanTitle: getLoanRule(loanType)?.title || loanType,
    documentGroups: catalog,
    documents: flattenDocuments(catalog)
  };
}

export async function createLoanApplication(payload, files = []) {
  const catalog = getDocumentCatalog(payload.loanType, payload.employmentType);
  const filesByField = buildFilesByField(files);
  const checklist = buildDocumentChecklist(catalog, filesByField);
  const summary = summarizeChecklist(checklist);
  const debtToIncome = calculateDebtToIncome(payload.monthlyIncome, payload.monthlyObligations);

  const requestPayload = {
    applicantId: payload.applicantId,
    applicantEmail: payload.applicantEmail,
    applicantName: payload.applicantName,
    loanType: payload.loanType,
    employmentType: payload.employmentType,
    requestedAmount: Number(payload.requestedAmount),
    monthlyIncome: Number(payload.monthlyIncome),
    monthlyObligations: Number(payload.monthlyObligations),
    creditScore: Number(payload.creditScore),
    tenureMonths: Number(payload.tenureMonths),
    interestRate: Number(payload.interestRate || 10),
    propertyValue: Number(payload.propertyValue || 0),
    identityDetails: payload.identityDetails || {},
    documents: checklist,
    notes: [],
    status: summary.missing > 0 ? 'draft' : 'submitted',
    adminRecommendation: 'PENDING',
    financierDecision: 'PENDING',
    riskScore: calculateRiskScore({ ...payload, debtToIncome }, checklist),
    debtToIncome,
    checklist,
    flags: getEligibilityFlags({ ...payload, debtToIncome }, checklist),
    decisionSummary: {
      emi: calculateEmi(payload.requestedAmount, payload.interestRate || 10, payload.tenureMonths),
      summary
    },
    auditTrail: [
      {
        actorRole: 'applicant',
        action: 'submitted-application',
        message: 'Applicant submitted the loan application with the tailored checklist.'
      }
    ]
  };

  return createApplication(requestPayload);
}

export async function getApplication(applicationId) {
  return findApplicationById(applicationId);
}

export async function getApplications(filter = {}) {
  return listApplications(filter);
}

export async function addNote(applicationId, note, actorRole) {
  const application = await findApplicationById(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }

  const notes = Array.isArray(application.notes) ? [...application.notes] : [];
  notes.unshift({
    id: `note_${Date.now()}`,
    actorRole,
    message: note,
    createdAt: new Date().toISOString()
  });

  return updateApplication(applicationId, {
    notes,
    auditTrail: [
      ...(application.auditTrail || []),
      {
        actorRole,
        action: 'added-note',
        message: note,
        createdAt: new Date().toISOString()
      }
    ]
  });
}

export async function reviewApplicationByAdmin(applicationId, payload) {
  const application = await findApplicationById(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }

  const updatedChecklist = (application.checklist || []).map((document) => {
    if (payload.mismatchedDocuments?.includes(document.id)) {
      return { ...document, status: 'mismatch', flagReasons: [...new Set([...(document.flagReasons || []), 'Identity details mismatch'])] };
    }

    if (payload.flaggedDocuments?.includes(document.id)) {
      return { ...document, status: 'flagged', flagReasons: [...new Set([...(document.flagReasons || []), 'Flagged by admin review'])] };
    }

    return document;
  });

  const riskScore = calculateRiskScore(application, updatedChecklist);
  const flags = getEligibilityFlags({ ...application, ...payload }, updatedChecklist);

  return updateApplication(applicationId, {
    checklist: updatedChecklist,
    flags,
    riskScore,
    adminRecommendation: payload.adminRecommendation,
    status: payload.adminRecommendation === 'APPROVE' ? 'admin-approved' : payload.adminRecommendation === 'REJECT' ? 'admin-rejected' : 'admin-review',
    auditTrail: [
      ...(application.auditTrail || []),
      {
        actorRole: 'admin',
        action: 'reviewed-application',
        message: payload.adminRecommendation,
        createdAt: new Date().toISOString()
      }
    ]
  });
}

export async function finalizeDecision(applicationId, payload) {
  const application = await findApplicationById(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }

  const emi = calculateEmi(application.requestedAmount, payload.interestRate || application.interestRate || 10, payload.tenureMonths || application.tenureMonths || 0);
  const decisionSummary = {
    emi,
    monthlyInstallment: emi,
    totalRepayable: Math.round(emi * (payload.tenureMonths || application.tenureMonths || 0)),
    interestRate: Number(payload.interestRate || application.interestRate || 0),
    tenureMonths: Number(payload.tenureMonths || application.tenureMonths || 0)
  };

  return updateApplication(applicationId, {
    interestRate: Number(payload.interestRate || application.interestRate || 0),
    tenureMonths: Number(payload.tenureMonths || application.tenureMonths || 0),
    financierDecision: payload.financierDecision,
    status: payload.financierDecision === 'SANCTION' ? 'sanctioned' : payload.financierDecision === 'REJECT' ? 'rejected' : 'conditional',
    decisionSummary,
    auditTrail: [
      ...(application.auditTrail || []),
      {
        actorRole: 'financier',
        action: 'finalized-decision',
        message: payload.financierDecision,
        createdAt: new Date().toISOString()
      }
    ]
  });
}
