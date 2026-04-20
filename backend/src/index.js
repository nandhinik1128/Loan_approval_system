import app from './app.js';
import { env } from './config/env.js';
import { connectStore, listUsers, seedUser } from './services/store.js';
import { demoApplications, demoUsers } from './data/seed.js';
import { createLoanApplication } from './services/applicationService.js';

async function seedDemoData() {
  const users = await listUsers();
  if (users.length > 0) {
    return;
  }

  for (const user of demoUsers) {
    await seedUser(user);
  }

  for (const application of demoApplications) {
    await createLoanApplication({
      ...application,
      applicantId: 'seed-applicant',
      applicantEmail: application.applicantEmail,
      applicantName: application.applicantName
    });
  }
}

async function start() {
  await connectStore();
  await seedDemoData();

  app.listen(env.port, () => {
    console.log(`Loan approval API running on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
