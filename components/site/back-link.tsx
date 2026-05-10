import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackLinkProps {
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link href={href as any} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-100">
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
