import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-center text-slate-100">
      <div className="max-w-xl rounded-3xl border border-slate-800 bg-slate-900/90 p-10 shadow-soft">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/90">Page not found</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">We couldn&apos;t find that audit.</h1>
        <p className="mt-4 text-slate-400">Return home and run a new AI spend audit for your team.</p>
        <Link href={"/" as any} className="mt-8 inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
          Go to landing page
        </Link>
      </div>
    </main>
  );
}
