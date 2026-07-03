import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
  }
>

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-[rgb(var(--primary))] text-[rgb(var(--text))] shadow-sm hover:brightness-95 focus-visible:ring-[rgb(var(--ring))]',
  secondary:
    'bg-[rgb(var(--surface-2))] text-[rgb(var(--text))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--surface))] focus-visible:ring-[rgb(var(--ring))]',
  ghost:
    'bg-transparent text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))] focus-visible:ring-[rgb(var(--ring))]',
  outline:
    'bg-[rgb(var(--surface))] text-[rgb(var(--text))] border border-[rgb(var(--border))] hover:border-[rgb(var(--primary-strong))] focus-visible:ring-[rgb(var(--ring))]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'size-11 p-0',
}

export function Button({
  children,
  className,
  variant = 'default',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))] disabled:pointer-events-none disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

