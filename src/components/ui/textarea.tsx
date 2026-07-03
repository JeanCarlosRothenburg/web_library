import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm text-[rgb(var(--text))] outline-none transition placeholder:text-[rgb(var(--muted))] focus:border-[rgb(var(--primary-strong))] focus:ring-2 focus:ring-[rgb(var(--ring))/0.2]',
        className,
      )}
      {...props}
    />
  )
}

