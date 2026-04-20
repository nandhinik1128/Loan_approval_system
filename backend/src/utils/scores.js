const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function calculateDebtToIncome(monthlyIncome, monthlyObligations) {
  const income = Number(monthlyIncome) || 0;
  const obligations = Number(monthlyObligations) || 0;

  if (!income) {
    return 0;
  }

  return Number(((obligations / income) * 100).toFixed(2));
}

export function calculateRiskScore(application, documentSummary = []) {
  const creditScore = Number(application.creditScore) || 0;
  const dti = Number(application.debtToIncome) || 0;
  const missingRequired = documentSummary.filter((document) => document.required && document.status !== 'uploaded').length;
  const flagged = documentSummary.filter((document) => document.status === 'flagged').length;

  let score = 100;
  if (creditScore < 650) score -= 20;
  if (dti > 40) score -= 20;
  score -= missingRequired * 8;
  score -= flagged * 5;

  if (application.loanType === 'business-loan') score -= 5;
  if (application.loanType === 'agricultural-loan') score -= 4;

  return clamp(score, 0, 100);
}

export function getEligibilityFlags(application, documentSummary = []) {
  const flags = [];
  const income = Number(application.monthlyIncome) || 0;
  const requested = Number(application.requestedAmount) || 0;

  if ((Number(application.creditScore) || 0) < 650) {
    flags.push('Credit score below 650');
  }

  if ((Number(application.debtToIncome) || 0) > 40) {
    flags.push('Debt-to-income ratio above 40%');
  }

  if (application.loanType === 'home-loan' && requested > income * 60) {
    flags.push('Home loan exceeds 60x monthly income');
  }

  if (application.loanType === 'personal-loan' && requested > income * 20) {
    flags.push('Personal loan exceeds 20x monthly income');
  }

  if (documentSummary.some((document) => document.status === 'mismatch')) {
    flags.push('Identity document mismatch detected');
  }

  return flags;
}
