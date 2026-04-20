import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { ForgotPasswordPage, LoginPage, SignupPage } from './pages/AuthPages.jsx';
import ApplicantDashboard from './pages/dashboards/ApplicantDashboard.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import FinancierDashboard from './pages/dashboards/FinancierDashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'financier') return <Navigate to="/financier" replace />;
  return <Navigate to="/applicant" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout title="Bank Loan Approval System" subtitle="Strict role-based approvals, document validation, and risk-aware decision making."><LandingPage /></Layout>} />
      <Route path="/login" element={<Layout title="Login" subtitle="Enter with your role-specific account."><LoginPage /></Layout>} />
      <Route path="/signup" element={<Layout title="Signup" subtitle="Create a separate account for each role."><SignupPage /></Layout>} />
      <Route path="/forgot-password" element={<Layout title="Reset password" subtitle="Use the OTP simulation to recover access."><ForgotPasswordPage /></Layout>} />
      <Route path="/applicant" element={<ProtectedRoute allowedRoles={['applicant']}><Layout title="Applicant Dashboard" subtitle="Generate a strictly tailored checklist, upload documents, and submit your application."><ApplicantDashboard /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout title="Admin Panel" subtitle="Validate documents, flag mismatches, and issue an approval recommendation."><AdminDashboard /></Layout></ProtectedRoute>} />
      <Route path="/financier" element={<ProtectedRoute allowedRoles={['financier']}><Layout title="Financier Panel" subtitle="Review risk, structure the loan, and finalize the sanction decision."><FinancierDashboard /></Layout></ProtectedRoute>} />
      <Route path="*" element={<DashboardRedirect />} />
    </Routes>
  );
}
