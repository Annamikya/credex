'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-24 pt-10 lg:pt-16">
      <div className="absolute left-1/2 top-0 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
            <p className="mb-5 inline-flex rounded-full bg-cyan-500/10 px-4 py-1.5 text-sm uppercase tracking-[0.35em] text-cyan-200">AI spending audit</p>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Stop Overspending on AI Tools</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Audit your AI stack and uncover hidden savings across ChatGPT, Claude, Cursor, Copilot, and APIs.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/audit">
                <Button className="min-w-[180px]">Start Free Audit</Button>
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition hover:text-white">
                Explore how it works <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85 }}>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft shadow-slate-950/20 backdrop-blur-xl">
              <div className="grid gap-6 rounded-[1.75rem] border border-slate-800 bg-slate-950 p-6 shadow-inner">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900 p-5">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Monthly spend</p>
                    <p className="mt-3 text-3xl font-semibold text-white">$4,800</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-5">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Potential savings</p>
                    <p className="mt-3 text-3xl font-semibold text-cyan-300">$1,200</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Recommended action</p>
                      <p className="mt-3 text-lg font-semibold text-white">Downgrade ChatGPT Team to Plus and optimize API spend.</p>
                    </div>
                    <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200">Premium</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
