import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classes: Array<string | boolean | undefined>) => twMerge(clsx(classes));
