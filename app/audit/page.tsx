import { AuditForm } from '../../components/audit/audit-form';
import { BackLink } from '../../components/site/back-link';

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <BackLink href="/" label="Back to home" />
        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft backdrop-blur-xl">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">AI Spend Auditor</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Build your AI stack audit.</h1>
              <p className="max-w-2xl text-slate-400">Add your tools, subscription plans, spend, seats, and use cases to generate a savings-ready audit report in minutes.</p>
            </div>
            <AuditForm />
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Built for operators</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">A modern form design for busy teams.</h2>
                <p className="mt-4 text-sm leading-6 text-slate-400">Save draft state automatically, validate fields in real time, and add unlimited AI products with a polished mobile-first experience.</p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Fast, actionable results</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">Once submitted, your audit appears instantly in the results dashboard with recommendations, charts, and shareable links.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Mobile-ready</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">Touch-friendly inputs, clear spacing, and responsive cards make it easy to audit on any device.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
