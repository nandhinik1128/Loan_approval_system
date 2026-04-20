export default function StatusPill({ value }) {
  const styles = {
    uploaded: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    missing: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
    flagged: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
    mismatch: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
    approved: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
    rejected: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
    submitted: 'bg-gold/15 text-gold border-gold/20'
  };

  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${styles[value] || styles.missing}`}>{value}</span>;
}
