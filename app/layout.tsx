import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { ThemeToggle } from '../components/shared/theme-toggle';
import { Navbar } from '../components/site/navbar';
import { siteConfig } from '../lib/site-config';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="relative isolate overflow-hidden bg-slate-950">
          <Navbar />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end py-4">
              <ThemeToggle />
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
