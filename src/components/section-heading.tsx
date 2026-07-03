import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-2">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent))]">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold tracking-tight text-[rgb(var(--text))] md:text-3xl">{title}</h2>
        {description ? <p className="max-w-xl text-sm leading-6 text-[rgb(var(--muted))] md:text-base">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center">{action}</div> : null}
    </div>
  )
}

