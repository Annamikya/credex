import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
        variant === 'secondary' && 'border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500',
        variant === 'ghost' && 'text-slate-100 hover:text-white',
        className
      )}
      {...props}
    />
  );
}
