import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import client from '../api/client.js';

const roleOptions = [
  { value: 'applicant', label: 'Applicant' },
  { value: 'admin', label: 'Admin' },
  { value: 'financier', label: 'Financier' }
];

function FormShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-panel/80 p-8 shadow-glow">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">Authentication</p>
      <h1 className="heading-serif mt-3 text-3xl font-bold text-white">{title}</h1>
      {subtitle ? <p className="mt-3 text-sm leading-6 text-slate-300">{subtitle}</p> : null}
      <div className="mt-8">{children}</div>
      {footer ? <div className="mt-6 text-sm text-slate-300">{footer}</div> : null}
    </div>
  );
}

function useFormState(initialState) {
  const [values, setValues] = useState(initialState);
  const onChange = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  return { values, setValues, onChange };
}

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { values, onChange } = useFormState({ email: '', password: '', role: 'applicant' });
  const [error, setError] = useState('');

  const rolePath = useMemo(() => `/${values.role}`, [values.role]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signIn(values);
      navigate(rolePath, { replace: true });
    } catch (exception) {
      setError(exception.response?.data?.message || exception.message);
    }
  };

  return (
    <FormShell title="Login" subtitle="Use the role-specific credentials to enter the correct dashboard." footer={<><Link to="/forgot-password" className="text-gold">Forgot password?</Link> · <Link to="/signup" className="text-gold">Create an account</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <select name="role" value={values.role} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none">
          {roleOptions.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
        </select>
        <input name="email" type="email" placeholder="Email" value={values.email} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
        <input name="password" type="password" placeholder="Password" value={values.password} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
        {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div> : null}
        <button className="w-full rounded-2xl bg-gold py-3 font-semibold text-ink">Sign in</button>
      </form>
    </FormShell>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { values, onChange } = useFormState({ name: '', email: '', phone: '', password: '', role: 'applicant' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signUp(values);
      navigate(`/${values.role}`, { replace: true });
    } catch (exception) {
      setError(exception.response?.data?.message || exception.message);
    }
  };

  return (
    <FormShell title="Signup" subtitle="Create a separate login for each role with JWT-backed access control.">
      <form onSubmit={submit} className="space-y-4">
        <select name="role" value={values.role} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none">
          {roleOptions.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
        </select>
        <input name="name" placeholder="Name" value={values.name} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
        <input name="email" type="email" placeholder="Email" value={values.email} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
        <input name="phone" placeholder="Phone" value={values.phone} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
        <input name="password" type="password" placeholder="Password" value={values.password} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
        {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div> : null}
        <button className="w-full rounded-2xl bg-gold py-3 font-semibold text-ink">Create account</button>
      </form>
    </FormShell>
  );
}

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [demoOtp, setDemoOtp] = useState('');
  const [error, setError] = useState('');
  const { values, onChange } = useFormState({ email: '', otp: '', newPassword: '' });

  const requestOtp = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await client.post('/auth/forgot-password', { email: values.email });
      setDemoOtp(response.data.otpForDemo || '');
      setStep(2);
    } catch (exception) {
      setError(exception.response?.data?.message || exception.message);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await client.post('/auth/reset-password', values);
      setStep(3);
    } catch (exception) {
      setError(exception.response?.data?.message || exception.message);
    }
  };

  return (
    <FormShell title="Forgot password" subtitle="OTP is simulated for the demo and returned inline after request.">
      {step === 1 ? (
        <form onSubmit={requestOtp} className="space-y-4">
          <input name="email" type="email" placeholder="Email" value={values.email} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
          {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div> : null}
          <button className="w-full rounded-2xl bg-gold py-3 font-semibold text-ink">Send OTP</button>
        </form>
      ) : step === 2 ? (
        <form onSubmit={resetPassword} className="space-y-4">
          <input name="email" type="email" placeholder="Email" value={values.email} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
          <input name="otp" placeholder="OTP" value={values.otp} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
          <input name="newPassword" type="password" placeholder="New password" value={values.newPassword} onChange={onChange} className="w-full rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
          {demoOtp ? <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">Demo OTP: {demoOtp}</div> : null}
          {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div> : null}
          <button className="w-full rounded-2xl bg-gold py-3 font-semibold text-ink">Reset password</button>
        </form>
      ) : (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-100">Password updated successfully. You can now log in.</div>
      )}
    </FormShell>
  );
}
