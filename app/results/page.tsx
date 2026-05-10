import { AuditResultShell } from '../../components/audit/audit-result-shell';

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <AuditResultShell />
      </div>
    </main>
  );
}
