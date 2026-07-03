import { useEffect, useState } from 'react'
import { createCoverDataUrl } from '../lib/covers'
import { cn } from '../lib/utils'

type BookCoverProps = {
  title: string
  coverUrl?: string | null
  seed?: number
  className?: string
  imgClassName?: string
  altPrefix?: string
}

export function BookCover({
  title,
  coverUrl,
  seed = 0,
  className,
  imgClassName,
  altPrefix = 'Capa de',
}: BookCoverProps) {
  const fallbackUrl = createCoverDataUrl(title, seed)
  const [src, setSrc] = useState(coverUrl || fallbackUrl)

  useEffect(() => {
    setSrc(coverUrl || fallbackUrl)
  }, [coverUrl, fallbackUrl])

  return (
    <div className={cn('overflow-hidden bg-[rgb(var(--surface-2))]', className)}>
      <img
        src={src}
        alt={`${altPrefix} ${title}`}
        className={cn('h-full w-full object-cover', imgClassName)}
        onError={() => {
          if (src !== fallbackUrl) {
            setSrc(fallbackUrl)
          }
        }}
      />
    </div>
  )
}

