import PDFDocument from 'pdfkit';

export function createDecisionLetter(application) {
  const document = new PDFDocument({ margin: 48 });
  document.fontSize(20).text('Bank Loan Decision Letter', { align: 'center' });
  document.moveDown();
  document.fontSize(12).text(`Applicant: ${application.applicantName || 'Unknown'}`);
  document.text(`Email: ${application.applicantEmail || 'Unknown'}`);
  document.text(`Loan Type: ${application.loanType}`);
  document.text(`Status: ${application.status}`);
  document.text(`Financier Decision: ${application.financierDecision || 'PENDING'}`);
  document.text(`Admin Recommendation: ${application.adminRecommendation || 'PENDING'}`);
  document.text(`Risk Score: ${application.riskScore ?? 0}/100`);
  document.text(`Debt-to-Income Ratio: ${application.debtToIncome ?? 0}%`);
  document.moveDown();
  document.text('Decision Summary', { underline: true });
  document.text(`Interest Rate: ${application.decisionSummary?.interestRate ?? application.interestRate ?? 0}%`);
  document.text(`EMI: ${application.decisionSummary?.monthlyInstallment ?? 0}`);
  document.text(`Total Repayable: ${application.decisionSummary?.totalRepayable ?? 0}`);
  document.moveDown();
  document.text('This letter is system-generated for internal banking workflow use.', { italic: true });
  document.end();
  return document;
}
