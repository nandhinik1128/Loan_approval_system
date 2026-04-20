export function calculateEmi(principal, annualRate, tenureMonths) {
  const amount = Number(principal) || 0;
  const rate = Number(annualRate) || 0;
  const months = Number(tenureMonths) || 0;

  if (!amount || !months) {
    return 0;
  }

  const monthlyRate = rate / 12 / 100;
  if (monthlyRate === 0) {
    return Math.round(amount / months);
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return Math.round((amount * monthlyRate * factor) / (factor - 1));
}
