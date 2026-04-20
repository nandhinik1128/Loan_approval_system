import { Router } from 'express';
import { getDocumentCatalog } from '../data/loanRules.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { addNote, createLoanApplication, finalizeDecision, generateDocumentRequirements, getApplication, getApplications, reviewApplicationByAdmin } from '../services/applicationService.js';
import { createDecisionLetter } from '../services/pdfService.js';

const router = Router();

router.post('/generate-documents', authenticate, authorizeRoles('applicant'), async (req, res) => {
  try {
    const payload = generateDocumentRequirements(req.body);
    res.json(payload);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/', authenticate, authorizeRoles('applicant'), upload.any(), async (req, res) => {
  try {
    const files = req.files || [];
    const application = await createLoanApplication(
      {
        ...req.body,
        applicantId: req.user.id,
        applicantEmail: req.user.email,
        applicantName: req.user.name,
        identityDetails: req.body.identityDetails ? JSON.parse(req.body.identityDetails) : {}
      },
      files
    );

    res.status(201).json({ application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/my', authenticate, authorizeRoles('applicant'), async (req, res) => {
  const applications = await getApplications({ applicantId: req.user.id });
  res.json({ applications });
});

router.get('/', authenticate, authorizeRoles('admin', 'financier'), async (_req, res) => {
  const applications = await getApplications();
  res.json({ applications });
});

router.get('/:id', authenticate, async (req, res) => {
  const application = await getApplication(req.params.id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (req.user.role === 'applicant' && application.applicantId !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json({ application, documentCatalog: getDocumentCatalog(application.loanType, application.employmentType) });
});

router.patch('/:id/admin-review', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const application = await reviewApplicationByAdmin(req.params.id, req.body);
    res.json({ application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id/financier-decision', authenticate, authorizeRoles('financier'), async (req, res) => {
  try {
    const application = await finalizeDecision(req.params.id, req.body);
    res.json({ application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/notes', authenticate, authorizeRoles('admin', 'financier'), async (req, res) => {
  try {
    const application = await addNote(req.params.id, req.body.note, req.user.role);
    res.json({ application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id/decision-letter', authenticate, authorizeRoles('admin', 'financier'), async (req, res) => {
  const application = await getApplication(req.params.id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const document = createDecisionLetter(application);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=loan-decision-${application.id}.pdf`);
  document.pipe(res);
});

export default router;
