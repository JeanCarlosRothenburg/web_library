import { useMemo, useState } from 'react'
import { BookCard } from '../components/book-card'
import { SectionHeading } from '../components/section-heading'
import { Input } from '../components/ui/input'
import { useSelection } from '../context/selection-context'
import { useBooks } from '../hooks/useBooks'

export function BooksPage() {
  const { books, loading, error } = useBooks()
  const [query, setQuery] = useState('')
  const { selectedBooks, addBook, removeBook } = useSelection()
  const selectedIds = new Set(selectedBooks.map((book) => book.id))

  const filteredBooks = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) {
      return books
    }

    return books.filter((book) =>
      [book.title, book.author, book.genre, book.synopsis, book.codigoLivro]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [books, query])

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Acervo"
        title="Listagem de livros"
        description="Pesquise por título, autor, gênero ou código do livro."
      />

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="book-search">
            Buscar no acervo
          </label>
          <Input
            id="book-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex.: Maria, romance, BGV-0001"
          />
        </div>
        <p className="text-sm text-[rgb(var(--muted))]">
          {filteredBooks.length} resultado{filteredBooks.length === 1 ? '' : 's'}
        </p>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-[rgb(var(--muted))]">Carregando acervo...</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              selected={selectedIds.has(book.id)}
              onToggleSelection={(item) => (selectedIds.has(item.id) ? removeBook(item.id) : addBook(item))}
            />
          ))}
        </div>
      )}

      {!loading && filteredBooks.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-10 text-center">
          <p className="text-lg font-semibold text-[rgb(var(--text))]">Nenhum livro encontrado</p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">Tente um termo diferente na busca.</p>
        </div>
      ) : null}
    </div>
  )
}

