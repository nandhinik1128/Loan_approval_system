import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, loginUser, registerUser, requestPasswordOtp, resetPassword } from '../services/authService.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const result = await requestPasswordOtp(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const result = await resetPassword(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const user = await getProfile(req.user.id);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

router.post('/logout', authenticate, async (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
