import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 text-sm text-[rgb(var(--text))] outline-none transition placeholder:text-[rgb(var(--muted))] focus:border-[rgb(var(--primary-strong))] focus:ring-2 focus:ring-[rgb(var(--ring))/0.2]',
        className,
      )}
      {...props}
    />
  )
}

