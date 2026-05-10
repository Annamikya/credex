import * as React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300', className)} {...props} />;
}
