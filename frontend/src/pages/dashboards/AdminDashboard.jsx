import { useEffect, useMemo, useState } from 'react';
import client from '../../api/client.js';
import MetricCard from '../../components/MetricCard.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import DocumentChecklist from '../../components/DocumentChecklist.jsx';

const defaultDecision = { adminRecommendation: 'CONDITIONAL APPROVE', note: '', flaggedDocuments: [], mismatchedDocuments: [] };

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState(defaultDecision);
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
    client.get(`/applications/${selectedId}`).then((response) => {
      setSelected(response.data.application);
      setDecision((current) => ({ ...current, flaggedDocuments: [], mismatchedDocuments: [] }));
    });
  }, [selectedId]);

  const refresh = async () => {
    const response = await client.get('/applications');
    setApplications(response.data.applications || []);
    const current = response.data.applications?.find((application) => application.id === selectedId);
    if (current) {
      setSelected(current);
    }
  };

  const handleCheckbox = (event, key) => {
    const { value, checked } = event.target;
    setDecision((current) => {
      const next = new Set(current[key]);
      if (checked) next.add(value);
      else next.delete(value);
      return { ...current, [key]: Array.from(next) };
    });
  };

  const saveReview = async () => {
    await client.patch(`/applications/${selectedId}/admin-review`, decision);
    setMessage('Review saved.');
    await refresh();
  };

  const addNote = async () => {
    if (!decision.note.trim()) return;
    await client.post(`/applications/${selectedId}/notes`, { note: decision.note });
    setDecision((current) => ({ ...current, note: '' }));
    await refresh();
  };

  const allDocuments = selectedApplication?.checklist || [];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <MetricCard label="Applications" value={applications.length} tone="gold" />
          <MetricCard label="Selected risk score" value={`${selectedApplication?.riskScore ?? 0}/100`} tone="danger" />
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
                  <StatusPill value={application.status} />
                </div>
                <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                  <div>Credit score: {application.creditScore}</div>
                  <div>DTI: {application.debtToIncome}%</div>
                  <div>Request: ₹{new Intl.NumberFormat('en-IN').format(application.requestedAmount || 0)}</div>
                  <div>Admin: {application.adminRecommendation || 'PENDING'}</div>
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
              <h2 className="text-xl font-semibold text-white">Application Review</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Applicant: <span className="text-white">{selectedApplication.applicantName}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Email: <span className="text-white">{selectedApplication.applicantEmail}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Loan type: <span className="text-white">{selectedApplication.loanType}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Credit score: <span className="text-white">{selectedApplication.creditScore}</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">DTI: <span className="text-white">{selectedApplication.debtToIncome}%</span></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Flags: <span className="text-white">{selectedApplication.flags?.join(', ') || 'None'}</span></div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <select value={decision.adminRecommendation} onChange={(event) => setDecision((current) => ({ ...current, adminRecommendation: event.target.value }))} className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none">
                  <option>APPROVE</option>
                  <option>CONDITIONAL APPROVE</option>
                  <option>REJECT</option>
                </select>
                <button onClick={saveReview} className="rounded-2xl bg-gold px-4 py-3 font-semibold text-ink">Save recommendation</button>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <textarea value={decision.note} onChange={(event) => setDecision((current) => ({ ...current, note: event.target.value }))} placeholder="Add internal notes" className="min-h-28 rounded-2xl border border-white/10 bg-ink px-4 py-3 text-white outline-none md:col-span-2" />
                <button onClick={addNote} className="rounded-2xl border border-white/10 px-4 py-3 text-white hover:bg-white/5">Add note</button>
                <div className="text-sm text-slate-400 self-center">Notes are stored in the application audit trail.</div>
              </div>

              {message ? <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{message}</div> : null}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-panel/80 p-6">
              <h3 className="text-lg font-semibold text-white">Document Checklist</h3>
              <div className="mt-4 space-y-3">
                {allDocuments.map((document) => (
                  <label key={document.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="mt-1 flex gap-2">
                      <input type="checkbox" value={document.id} onChange={(event) => handleCheckbox(event, 'flaggedDocuments')} className="h-4 w-4 rounded border-white/20 bg-ink text-gold" title="Flag document" />
                      <input type="checkbox" value={document.id} onChange={(event) => handleCheckbox(event, 'mismatchedDocuments')} className="h-4 w-4 rounded border-white/20 bg-ink text-amber-400" title="Mark identity mismatch" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{document.label}</div>
                      <div className="text-xs text-slate-400">Status: {document.status}</div>
                      <div className="mt-1 text-slate-300">{document.instructions}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-panel/80 p-6 text-slate-300">No application selected.</div>
        )}

        <DocumentChecklist documentGroups={selectedApplication?.checklist?.length ? [{ title: 'Validated documents', documents: selectedApplication.checklist }] : []} showInstructions={false} />
      </section>
    </div>
  );
}
