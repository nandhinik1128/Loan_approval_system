export default function MetricCard({ label, value, hint, tone = 'default' }) {
  const toneClasses = {
    default: 'from-white/10 to-white/5',
    gold: 'from-gold/20 to-white/5',
    mint: 'from-mint/20 to-white/5',
    danger: 'from-danger/20 to-white/5'
  };

  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${toneClasses[tone]} p-5 shadow-glow`}>
      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>
      {hint ? <div className="mt-2 text-sm text-slate-300">{hint}</div> : null}
    </div>
  );
}
