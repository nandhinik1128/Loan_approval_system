import StatusPill from './StatusPill.jsx';

export default function DocumentChecklist({ documentGroups = [], showInstructions = true }) {
  return (
    <div className="space-y-4">
      {documentGroups.map((group) => (
        <section key={group.title} className="rounded-3xl border border-white/10 bg-panel/80 p-5">
          <h3 className="text-lg font-semibold text-white">{group.title}</h3>
          <div className="mt-4 space-y-3">
            {group.documents.map((document) => (
              <div key={document.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{document.label}</div>
                    <div className="mt-1 text-sm text-slate-300">Required: {document.required ? 'Yes' : 'Optional'}</div>
                  </div>
                  <StatusPill value={document.status || (document.required ? 'missing' : 'uploaded')} />
                </div>
                {showInstructions ? <p className="mt-3 text-sm leading-6 text-slate-300">{document.instructions}</p> : null}
                <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                  <div>File name: {document.filenameHint}</div>
                  <div>Allowed: {document.allowedFormats?.join(', ')} · Max {document.maxSizeMb}MB</div>
                </div>
                {document.flagReasons?.length ? <div className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-100">{document.flagReasons.join(' · ')}</div> : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
