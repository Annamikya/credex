'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AuditResult } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const SavingsChart = dynamic(() => import('./savings-chart').then((mod) => mod.SavingsChart), {
  ssr: false
});

const MonthlyYearlyChart = dynamic(() => import('./savings-chart').then((mod) => mod.MonthlyYearlyChart), {
  ssr: false
});

function Counter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span aria-live="polite">{count.toLocaleString()}</span>;
}

export function AuditResultShell() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem('ai-spend-audit-result');
    if (stored) {
      const parsed = JSON.parse(stored) as AuditResult;
      setResult(parsed);
      setShareUrl(`${window.location.origin}/share/${parsed.id}`);
    }
    setIsLoading(false);
  }, []);

  const chartData = useMemo(
    () =>
      result?.recommendations.map((item) => ({
        name: item.tool,
        savings: item.monthlySavings
      })) ?? [],
    [result]
  );

  const toolPlanMap = useMemo(
    () => new Map(result?.tools.map((tool) => [tool.tool, tool.plan]) ?? []),
    [result?.tools]
  );

  const consultationRecommended = (result?.totalMonthlySavings ?? 0) > 500;
  const dashboardMessage = consultationRecommended
    ? 'Your AI stack shows strong optimization potential. Consider a Credex consultation for deeper finance-ready savings insights.'
    : 'Your current savings are modest. Keep tracking spend and revisit audits as usage evolves.';

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <Card className="space-y-6 py-24 text-center">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-cyan-500/20" />
        <h1 className="text-3xl font-semibold text-white">Loading your audit dashboard…</h1>
        <p className="text-slate-400">A polished report is on its way.</p>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="space-y-6 py-20 text-center">
        <h1 className="text-3xl font-semibold text-white">No audit loaded yet</h1>
        <p className="text-slate-400">Run an audit from the form to see your results here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-12"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10" />
        <div className="relative">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm uppercase tracking-[0.35em] text-cyan-300"
          >
            Audit results
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-4xl font-bold text-white lg:text-5xl"
          >
            Potential Savings Identified
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 text-6xl font-bold text-cyan-300 lg:text-7xl"
          >
            $<Counter value={result.totalYearlySavings} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-4 text-lg text-slate-300"
          >
            Annual savings potential across your AI stack
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            <div className="rounded-2xl bg-slate-950/50 p-6 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Monthly savings</p>
              <p className="mt-2 text-3xl font-semibold text-cyan-300">
                ${result.totalMonthlySavings.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-950/50 p-6 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Yearly savings</p>
              <p className="mt-2 text-3xl font-semibold text-cyan-300">
                ${result.totalYearlySavings.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Monthly savings snapshot</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">The dashboard highlights your top recommendations and monthly savings by tool.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Insights</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{dashboardMessage}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-900 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Total savings</p>
              <p className="mt-3 text-2xl font-semibold text-cyan-300">{formatCurrency(result.totalMonthlySavings)}</p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Monthly spend</p>
              <p className="mt-3 text-2xl font-semibold text-white">{formatCurrency(result.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0))}</p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Recommendations</p>
              <p className="mt-3 text-2xl font-semibold text-white">{result.recommendations.length}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Savings by tool</p>
                <p className="mt-2 text-sm text-slate-400">High-impact insights for each recommendation.</p>
              </div>
            </div>
            <div className="mt-6 h-[320px]">
              <SavingsChart data={chartData} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Monthly vs Yearly Savings</p>
                <p className="mt-2 text-sm text-slate-400">Compare your potential savings over time.</p>
              </div>
            </div>
            <div className="mt-6 h-[320px]">
              <MonthlyYearlyChart monthly={result.totalMonthlySavings} yearly={result.totalYearlySavings} />
            </div>
          </div>

          <Card className="space-y-4">
            {result.recommendations.map((item, index) => (
              <motion.div
                key={item.tool}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-lg transition-all hover:border-cyan-500/30 hover:shadow-cyan-500/10"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-semibold text-white">{item.tool}</p>
                      <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-300">
                        High Impact
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Current:</span>
                        <span className="text-slate-100">{item.currentPlan}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Recommended:</span>
                        <span className="text-cyan-300">{item.suggestion}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-300">{formatCurrency(item.monthlySavings)}</p>
                    <p className="text-sm text-slate-400">monthly savings</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Card>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Shareable audit</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">Share a sanitized view with stakeholders or copy a direct audit link.</p>
            <div className="mt-6 space-y-3">
              <Button onClick={() => setShareOpen(true)}>Copy share link</Button>
              <a href={`/share/${result.id}`} className="inline-flex w-full items-center justify-center rounded-full bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Open public audit
              </a>
            </div>
            {copied ? <p className="mt-4 text-sm text-cyan-300">Link copied to clipboard.</p> : null}
          </Card>

          <Card className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Recommended next step</p>
            <p className="mt-4 text-lg font-semibold text-white">{consultationRecommended ? 'Credex consultation recommended' : 'Keep iterating your audit'}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{consultationRecommended ? 'Your current savings are strong enough to justify an expert review and investor-ready summary.' : 'You have a solid starting point. Revisit the audit as your usage grows.'}</p>
          </Card>

          <Card className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Savings breakdown</p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
              <div className="hidden sm:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-950/70 text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Tool</th>
                      <th className="px-4 py-3">Current Plan</th>
                      <th className="px-4 py-3">Recommendation</th>
                      <th className="px-4 py-3 text-right">Monthly Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.recommendations.map((item, index) => (
                      <tr key={item.tool} className={`border-t border-slate-800 ${index % 2 === 0 ? 'bg-slate-900/50' : ''}`}>
                        <td className="px-4 py-3 text-white font-medium">{item.tool}</td>
                        <td className="px-4 py-3 text-slate-400">{toolPlanMap.get(item.tool) ?? 'Unknown'}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-medium text-cyan-300">
                            {item.suggestion}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-cyan-300 font-semibold">{formatCurrency(item.monthlySavings)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sm:hidden space-y-4">
                {result.recommendations.map((item, index) => (
                  <div key={item.tool} className={`rounded-lg border border-slate-800 p-4 ${index % 2 === 0 ? 'bg-slate-900/50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{item.tool}</span>
                      <span className="text-cyan-300 font-semibold">{formatCurrency(item.monthlySavings)}</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-400">
                      Current: {toolPlanMap.get(item.tool) ?? 'Unknown'}
                    </div>
                    <div className="mt-1">
                      <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-medium text-cyan-300">
                        {item.suggestion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {shareOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4" role="dialog" aria-modal="true" aria-labelledby="share-title">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 id="share-title" className="text-xl font-semibold text-white">Share audit link</h2>
                <p className="mt-2 text-sm text-slate-400">Copy the public audit URL to share with your team or stakeholders.</p>
              </div>
              <button onClick={() => setShareOpen(false)} className="text-slate-400 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Close share modal">
                Close
              </button>
            </div>
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Public share URL</p>
              <p className="mt-3 break-all text-sm text-white" aria-label="Share URL">{shareUrl}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button onClick={handleCopy} aria-label="Copy share link to clipboard">{copied ? 'Copied!' : 'Copy link'}</Button>
              <a href={`/share/${result.id}`} className="inline-flex items-center justify-center rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Open public audit view">
                Open public view
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
