import { useRef } from 'react'
import type { Book } from '../types/app'
import { Button } from './ui/button'
import { BookCard } from './book-card'

type BookCarouselProps = {
  title: string
  books: Book[]
  onToggleSelection: (book: Book) => void
  selectedIds: Set<string>
}

export function BookCarousel({ title, books, onToggleSelection, selectedIds }: BookCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)

  const scroll = (direction: number) => {
    trackRef.current?.scrollBy({
      left: direction * 360,
      behavior: 'smooth',
    })
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[rgb(var(--text))]">{title}</h3>
          <p className="text-sm text-[rgb(var(--muted))]">Escolha livros e mantenha a seleção para agendar a retirada.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" onClick={() => scroll(-1)} aria-label="Voltar">
            <ArrowLeft />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => scroll(1)} aria-label="Avancar">
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="grid grid-flow-col auto-cols-[minmax(18rem,18rem)] gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {books.map((book) => (
          <div key={book.id} className="snap-start">
            <BookCard
              book={book}
              selected={selectedIds.has(book.id)}
              onToggleSelection={onToggleSelection}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
      <path d="M15 18 9 12l6-6" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

