import { ArrowUpRight, DollarSign, Shield, Zap } from 'lucide-react';
import { Card } from '../ui/card';

const examples = [
  {
    title: 'ChatGPT Team downgrade',
    result: 'Save up to 38% annually',
    icon: ArrowUpRight
  },
  {
    title: 'OpenAI API credits',
    result: 'Reduce monthly spend by $4,200',
    icon: DollarSign
  },
  {
    title: 'Copilot seat efficiency',
    result: 'Trim unused corporate seats',
    icon: Shield
  },
  {
    title: 'Claude business review',
    result: 'Avoid non-essential enterprise tiers',
    icon: Zap
  }
];

export function SavingsSamples() {
  return (
    <section id="examples" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-1">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Example insights</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Savings narratives that feel investor-ready.</h2>
          <p className="mt-5 text-slate-400">Each audit example showcases business-friendly recommendations and measurable annual impact.</p>
        </div>
        <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
          {examples.map((item) => (
            <Card key={item.title} className="group flex flex-col gap-4 p-6 transition hover:-translate-y-1 hover:bg-slate-900/95">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.result}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
