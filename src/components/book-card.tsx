import { NavLink } from 'react-router-dom'
import { cn } from '../lib/utils'
import type { Book } from '../types/app'
import { BookCover } from './book-cover'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

type BookCardProps = {
  book: Book
  selected?: boolean
  onToggleSelection?: (book: Book) => void
}

export function BookCard({ book, selected = false, onToggleSelection }: BookCardProps) {
  const available = book.availableCopies > 0

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-[rgb(var(--surface-2))]">
        <BookCover
          title={book.title}
          coverUrl={book.coverUrl}
          seed={book.featuredRank}
          className="h-full w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
          <Badge variant="default">{available ? 'Disponível' : 'Indisponível'}</Badge>
          <Badge variant="outline">{book.genre}</Badge>
        </div>
      </div>
      <CardContent className="space-y-4 pt-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent))]">{book.codigoLivro}</p>
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-[rgb(var(--text))]">{book.title}</h3>
          <p className="text-sm text-[rgb(var(--muted))]">{book.author}</p>
          <p className="line-clamp-3 text-sm leading-6 text-[rgb(var(--muted))]">{book.synopsis}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-[rgb(var(--muted))]">
          <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1">{book.publishedYear}</span>
          <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1">{book.pages} páginas</span>
          <span className="rounded-full bg-[rgb(var(--surface-2))] px-3 py-1">
            {book.availableCopies}/{book.totalCopies} exemplares
          </span>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to={`/books/${book.codigoLivro}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Ver detalhes
            </Button>
          </NavLink>
          <Button
            variant={selected ? 'secondary' : 'default'}
            className={cn('flex-1', !available && 'opacity-70')}
            onClick={() => onToggleSelection?.(book)}
          >
            {selected ? 'Remover' : 'Selecionar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
