import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card className="space-y-4 p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/95">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </Card>
  );
}
