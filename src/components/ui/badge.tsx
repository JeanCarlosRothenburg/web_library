import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

type BadgeVariant = 'default' | 'muted' | 'outline'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[rgb(var(--primary))] text-[rgb(var(--text))]',
  muted: 'bg-[rgb(var(--surface-2))] text-[rgb(var(--muted))]',
  outline: 'border border-[rgb(var(--border))] bg-transparent text-[rgb(var(--text))]',
}

export function Badge({
  children,
  className,
  variant = 'default',
  ...props
}: PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant
  }
>) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}

