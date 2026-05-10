import { CheckCircle2, Clock3, Layers } from 'lucide-react';
import { Card } from '../ui/card';

const steps = [
  {
    title: 'Enter your tools',
    description: 'Add ChatGPT, Claude, Cursor, Copilot, Gemini, and API spend with plan details and seats.',
    icon: Clock3
  },
  {
    title: 'Review savings',
    description: 'Our rule-based engine highlights downgrade suggestions, alternative plans, and yearly savings.',
    icon: Layers
  },
  {
    title: 'Share the report',
    description: 'Publish a compact shareable audit page for founders, investors, or finance teams.',
    icon: CheckCircle2
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">How it works</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Audit your AI spend in three fast steps.</h2>
          <p className="mt-6 max-w-2xl text-slate-400">A modern audit workflow built for founders and finance teams to understand overspend and optimize plan choices without guesswork.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {steps.map((step) => (
            <Card key={step.title} className="group flex gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/95">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                <step.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
