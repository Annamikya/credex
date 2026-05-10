import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/75 bg-slate-950/95 py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">AI Spend Auditor</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">A premium audit experience for operators and early-stage teams focused on efficiency, transparency, and investor-ready reporting.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <Link href="/audit" className="transition hover:text-white">Audit form</Link>
          <Link href="/results" className="transition hover:text-white">Audit results</Link>
          <Link href="/share/sample-audit" className="transition hover:text-white">Share URL</Link>
          <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@aispendauditor.com'}`} className="transition hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
