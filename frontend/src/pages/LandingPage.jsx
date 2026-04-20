import { Link } from 'react-router-dom';

const roles = [
  { title: 'Applicant', to: '/signup', copy: 'Submit a fully tailored loan application with exact document rules.' },
  { title: 'Admin', to: '/login', copy: 'Review compliance, document gaps, credit flags, and recommendations.' },
  { title: 'Financier', to: '/login', copy: 'Assess risk, structure the loan, and generate sanction letters.' }
];

export default function LandingPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="glass rounded-[2rem] p-8 shadow-glow">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Production workflow demo</p>
        <h1 className="heading-serif mt-4 max-w-3xl text-4xl font-bold sm:text-6xl">A bank loan approval system with role-locked decision intelligence.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
          Applicants receive a strict, loan-specific document checklist. Admins validate compliance and eligibility. Financiers make the final sanction decision and generate PDF letters.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/signup" className="rounded-full bg-gold px-6 py-3 font-semibold text-ink">Start as Applicant</Link>
          <Link to="/login" className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white hover:bg-white/5">Login</Link>
        </div>
      </section>

      <section className="space-y-4">
        {roles.map((role) => (
          <Link key={role.title} to={role.to} className="block rounded-[1.75rem] border border-white/10 bg-panel/80 p-6 transition hover:-translate-y-1 hover:border-gold/30">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Role</div>
            <div className="mt-2 text-2xl font-semibold text-white">{role.title}</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{role.copy}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
