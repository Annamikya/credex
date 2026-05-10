import Link from 'next/link';
import { Button } from '../ui/button';

const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Examples', href: '#examples' },
  { label: 'FAQ', href: '#faq' }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/75 bg-slate-950/95 backdrop-blur-xl shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-white">
          <span className="rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 px-3 py-1 text-sm font-semibold text-slate-950">Credex</span>
          <span className="text-slate-300">AI Spend Auditor</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-slate-300 transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/audit">
          <Button className="whitespace-nowrap">Start Free Audit</Button>
        </Link>
      </nav>
    </header>
  );
}
