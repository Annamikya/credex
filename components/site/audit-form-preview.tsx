import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export function AuditFormPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Audit form</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Create your AI spend audit in minutes.</h2>
          <p className="mt-6 max-w-2xl text-slate-400">The form supports multiple tools, plans, seats, and use cases with built-in validation and persistence so you can return to your draft anytime.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge>ChatGPT</Badge>
            <Badge>Claude</Badge>
            <Badge>Cursor</Badge>
            <Badge>Copilot</Badge>
            <Badge>Gemini</Badge>
          </div>
          <Link href={"/audit" as any} className="mt-8 inline-flex rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Start audit
          </Link>
        </div>
        <Card className="space-y-5 p-6">
          <div className="rounded-3xl bg-slate-950 p-5">
            <p className="text-sm text-slate-400">Selected tools</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-3xl border border-slate-800 p-4">
                <span className="font-medium text-white">ChatGPT</span>
                <span className="text-sm text-slate-400">Team • $750</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-slate-800 p-4">
                <span className="font-medium text-white">OpenAI API</span>
                <span className="text-sm text-slate-400">$1,500</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
