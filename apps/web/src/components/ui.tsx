import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900', className)} {...props} />;
}

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn('rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white', className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('w-full rounded-xl border border-slate-300 bg-transparent p-2 dark:border-slate-700', className)} {...props} />;
}
