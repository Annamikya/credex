import { notFound } from 'next/navigation';
import { getPublicAudit } from '../../../lib/audit';
import { AuditPublicView } from '../../../components/audit/audit-public-view';
import { siteConfig } from '../../../lib/site-config';

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getPublicAudit(id);

  if (!audit) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-soft backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Audit share link</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{siteConfig.title} summary</h1>
          <p className="mt-3 max-w-2xl text-slate-400">A public snapshot of your audit findings without exposing sensitive identifiable team details.</p>
        </div>
        <AuditPublicView audit={audit} />
      </div>
    </main>
  );
}
