import { useEffect, useMemo, useState } from 'react';
import client from '../../api/client.js';
import MetricCard from '../../components/MetricCard.jsx';
import StatusPill from '../../components/StatusPill.jsx';

const decisions = ['SANCTION', 'SANCTION WITH CONDITIONS', 'REJECT', 'REQUEST MORE DOCUMENTS'];

export default function FinancierDashboard() {
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ decision: 'SANCTION', interestRate: 9.1, tenureMonths: 240 });
  const [message, setMessage] = useState('');

  const selectedApplication = useMemo(() => selected, [selected]);

  useEffect(() => {
    client.get('/applications').then((response) => {
      setApplications(response.data.applications || []);
      if (!selectedId && response.data.applications?.[0]) {
        setSelectedId(response.data.applications[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    client.get(`/applications/${selectedId}`).then((response) => setSelected(response.data.application));
  }, [selectedId]);

  const refresh = async () => {
    const response = await client.get('/applications');
    setApplications(response.data.applications || []);
    const current = response.data.applications?.find((application) => application.id === selectedId);
    if (current) setSelected(current);
  };

  const saveDecision = async () => {
    await client.patch(`/applications/${selectedId}/financier-decision`, {
      financierDecision: form.decision,
      interestRate: Number(form.interestRate),
      tenureMonths: Number(form.tenureMonths)
    });
    setMessage('Decision saved.');
    await refresh();
  };

  const downloadLetter = async () => {
    const response = await client.get(`/applications/${selectedId}/decision-letter`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `loan-decision-${selectedId}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <MetricCard label="Applications" value={applications.length} tone="mint" />
          <MetricCard label="Risk score" value={`${selectedApplication?.riskScore ?? 0}/100`} tone="danger" />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-panel/80 p-5">
          <h2 className="text-lg font-semibold text-white">Application Queue</h2>
          <div className="mt-4 space-y-3">
            {applications.map((application) => (
              <button key={application.id} onClick={() => setSelectedId(application.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedId === application.id ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:bg-white/8'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{application.applicantName}</div>
                    <div className="text-sm text-slate-300">{application.loanType}</div>
                  </div>
                  <StatusPill value={application.financierDecision || 'pending'} />
                </div>
                <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                  <div>Risk score: {application.riskScore ?? 0}</div>
                  <div>DTI: {application.debtToIncome}%</div>
                  <div>EMI: {application.decisionSummary?.monthlyInstallment ?? 0}</div>
                  <div>Credit score: {application.creditScore}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {selectedApplication ? (
          <>
            <div className="rounded-[2rem] border border-white/10 bg-panel/80 p-6 shadow-glow">
              <h2 className="text-xl font-semibold text-white">Loan Structuring</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Applicant: <span className="text-white">{selectedApplication.applicantName}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Loan type: <span className="text-white">{selectedApplication.loanType}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Requested amount: <span className="text-white">₹{new Intl.NumberFormat('en-IN').format(selectedApplication.requestedAmount || 0)}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Risk score: <span className="text-white">{selectedApplication.riskScore ?? 0}/100</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Flags: <span className="text-white">{selectedApplication.flags?.join(', ') || 'None'}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">EMI: <span className="text-white">{selectedApplication.decisionSummary?.monthlyInstallment ?? 0}</span></div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <select value={form.decision} onChange={(event) => setForm((current) => ({ ...current, decision: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none md:col-span-1">
                  {decisions.map((decision) => <option key={decision} value={decision}>{decision}</option>)}
                </select>
                <input value={form.interestRate} onChange={(event) => setForm((current) => ({ ...current, interestRate: event.target.value }))} placeholder="Interest rate" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
                <input value={form.tenureMonths} onChange={(event) => setForm((current) => ({ ...current, tenureMonths: event.target.value }))} placeholder="Tenure months" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none" />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={saveDecision} className="rounded-2xl bg-gold px-4 py-3 font-semibold text-ink">Save decision</button>
                <button onClick={downloadLetter} className="rounded-2xl border border-white/10 px-4 py-3 text-white hover:bg-white/5">Generate PDF letter</button>
              </div>

              {message ? <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{message}</div> : null}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-panel/80 p-6">
              <h3 className="text-lg font-semibold text-white">Decision intelligence</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Credit score flag: <span className="text-white">{(selectedApplication.creditScore || 0) < 650 ? 'Yes' : 'No'}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">DTI flag: <span className="text-white">{(selectedApplication.debtToIncome || 0) > 40 ? 'Yes' : 'No'}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Eligibility: <span className="text-white">{selectedApplication.flags?.length ? 'Needs review' : 'Clean'}</span></div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-panel/80 p-6 text-slate-300">No application selected.</div>
        )}
      </section>
    </div>
  );
}
