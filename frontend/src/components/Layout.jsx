import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ title, subtitle, children }) {
  const { user, signOut } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-gold text-ink font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'}`;

  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-ink/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold text-ink font-bold shadow-glow">LA</div>
            <div>
              <div className="font-semibold tracking-wide">Loan Approval System</div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Bank-grade workflow engine</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/applicant" className={navLinkClass}>Applicant</NavLink>
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            <NavLink to="/financier" className={navLinkClass}>Financier</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {user ? <span className="hidden text-sm text-slate-300 sm:inline">{user.name} · {user.role}</span> : null}
            {user ? (
              <button onClick={signOut} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">
                Logout
              </button>
            ) : (
              <Link to="/login" className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {title ? (
          <section className="mb-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-glow">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Loan workflow</p>
            <h1 className="heading-serif mt-2 text-3xl font-bold sm:text-5xl">{title}</h1>
            {subtitle ? <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">{subtitle}</p> : null}
          </section>
        ) : null}
        {children}
      </main>
    </div>
  );
}
