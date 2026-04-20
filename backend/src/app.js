import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import lookupRoutes from './routes/lookup.js';
import { env } from './config/env.js';

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'loan-approval-system-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/lookups', lookupRoutes);

app.use((error, _req, res, _next) => {
  res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
});

export default app;
