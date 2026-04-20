# Bank Loan Approval System

A full-stack loan approval workflow application with role-based access, tailored document validation, admin review controls, financier decisioning, JWT auth, OTP password reset simulation, and PDF decision letters.

This repository is organized as a monorepo with separate backend and frontend workspaces.

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Vite
- Backend: Node.js, Express
- Database: MongoDB via Mongoose, with in-memory fallback when `MONGO_URI` is not provided
- Auth: JWT + bcrypt

## Folder Structure

```text
.
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
├── backend
│   ├── package.json
│   ├── uploads
│   └── src
│       ├── config
│       ├── data
│       ├── middleware
│       ├── routes
│       ├── services
│       └── utils
├── frontend
│   ├── package.json
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   └── main.jsx
│   └── vite.config.js
```

## Setup

1. Install dependencies from the repository root.
2. Copy `.env.example` to `.env` if you want to use MongoDB or override defaults.
3. Start the backend and frontend together with `npm run dev`.

### Environment Variables

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/loan_approval_system
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## Available Scripts

- `npm run dev` - starts server and client together
- `npm run build` - runs the client production build and a server build stub
- `npm run start` - starts the backend only
- `npm run dev --workspace backend` - starts the backend only
- `npm run dev --workspace frontend` - starts the frontend only

## GitHub Push

The repository is now structured so you can initialize git at the root and push it as one project.

If you have not created the GitHub repo yet, do this from the root folder:

```bash
git init
git add .
git commit -m "Initial bank loan approval system"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Do not commit `node_modules`; they are intentionally ignored.

## Demo Accounts

The backend seeds these demo users on first start:

- Applicant: `applicant@example.com` / `Password@123`
- Admin: `admin@example.com` / `Password@123`
- Financier: `financier@example.com` / `Password@123`

## Workflow

- Applicants select a loan type and employment type.
- The API returns a strict, loan-specific checklist with exact instructions.
- Applicants upload documents using the generated field names.
- Admins review the application, flag documents, mark identity mismatches, add notes, and recommend approve / conditional approve / reject.
- Financiers review risk, structure the loan, finalize the decision, and generate PDF decision letters.

## Notes

- Allowed document formats are PDF, JPG, and PNG.
- Maximum file size is 5MB per document.
- The application will use MongoDB when `MONGO_URI` is present; otherwise it falls back to the built-in in-memory store so the app still runs without additional services.
- The filename must match the document type slug shown in the UI.
