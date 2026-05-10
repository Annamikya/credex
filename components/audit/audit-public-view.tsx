import { formatCurrency } from '../../lib/utils';
import { AuditResult } from '../../types';
import { Card } from '../ui/card';

interface AuditPublicViewProps {
  audit: AuditResult;
}

export function AuditPublicView({ audit }: AuditPublicViewProps) {
  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Public savings summary</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Estimated yearly savings</h2>
          </div>
          <p className="text-3xl font-semibold text-cyan-300">{formatCurrency(audit.totalYearlySavings)}</p>
        </div>
        <p className="text-sm leading-7 text-slate-300">This public snapshot highlights the savings potential across the audited AI tools without exposing confidential details.</p>
      </Card>
      <Card className="space-y-6">
        <div className="grid gap-4">
          {audit.recommendations.map((item) => (
            <div key={item.tool} className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-white">{item.tool}</p>
                <span className="text-sm text-cyan-300">{formatCurrency(item.monthlySavings)}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.suggestion}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Executive summary</p>
        <p className="text-sm leading-7 text-slate-300">{audit.summary}</p>
      </Card>
    </div>
  );
}
