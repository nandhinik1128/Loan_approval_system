import { Router } from 'express';
import { getDocumentCatalog, getLoanRule } from '../data/loanRules.js';

const router = Router();

router.get('/loan-types', (_req, res) => {
  res.json({
    loanTypes: [
      { value: 'home-loan', label: 'Home Loan' },
      { value: 'personal-loan', label: 'Personal Loan' },
      { value: 'vehicle-loan', label: 'Vehicle Loan' },
      { value: 'business-loan', label: 'Business Loan' },
      { value: 'education-loan', label: 'Education Loan' },
      { value: 'gold-loan', label: 'Gold Loan' },
      { value: 'mortgage-loan', label: 'Mortgage / Loan Against Property' },
      { value: 'agricultural-loan', label: 'Agricultural Loan' }
    ]
  });
});

router.get('/loan-rules/:loanType', (req, res) => {
  const loanType = req.params.loanType;
  const loanRule = getLoanRule(loanType);
  if (!loanRule) {
    return res.status(404).json({ message: 'Loan type not found' });
  }

  res.json({
    loanType,
    title: loanRule.title,
    documentGroups: getDocumentCatalog(loanType, req.query.employmentType || 'salaried')
  });
});

export default router;
