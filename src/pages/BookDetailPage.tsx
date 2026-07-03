import { Link, Navigate, useParams } from 'react-router-dom'
import { SectionHeading } from '../components/section-heading'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useSelection } from '../context/selection-context'
import { useBooks } from '../hooks/useBooks'
import { BookCover } from '../components/book-cover'

export function BookDetailPage() {
  const { codigoLivro } = useParams()
  const { getBookByCodigoLivro } = useBooks()
  const { selectedBooks, addBook, removeBook, isSelected } = useSelection()
  const book = codigoLivro ? getBookByCodigoLivro(codigoLivro) : undefined

  if (!codigoLivro) {
    return <Navigate to="/books" replace />
  }

  if (!book) {
    return (
      <div className="rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-[rgb(var(--accent))]">Não encontrado</p>
        <h1 className="mt-3 text-3xl font-semibold text-[rgb(var(--text))]">Este livro não está cadastrado no momento.</h1>
        <Link to="/books">
          <Button className="mt-6">Voltar ao acervo</Button>
        </Link>
      </div>
    )
  }

  const selected = isSelected(book.id)
  const availabilityText = book.availableCopies > 0 ? 'Disponível para retirada presencial' : 'No momento sem exemplares livres'

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Detalhe do livro"
        title={book.title}
        description="A seleção do livro prepara apenas o agendamento presencial. A retirada continua sendo feita na biblioteca."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden">
          <div className="aspect-[3/4] bg-[rgb(var(--surface-2))]">
            <BookCover title={book.title} coverUrl={book.coverUrl} seed={book.featuredRank} className="h-full w-full" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="flex flex-wrap gap-2">
                <Badge>{book.genre}</Badge>
                <Badge variant="outline">{book.codigoLivro}</Badge>
                <Badge variant={book.availableCopies > 0 ? 'default' : 'muted'}>{availabilityText}</Badge>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-[rgb(var(--muted))]">Autor</p>
                <p className="text-2xl font-semibold tracking-tight text-[rgb(var(--text))]">{book.author}</p>
                <p className="text-sm leading-7 text-[rgb(var(--muted))]">{book.synopsis}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Ano', String(book.publishedYear)],
                  ['Idioma', book.language],
                  ['Páginas', String(book.pages)],
                  ['Disponibilidade', `${book.availableCopies}/${book.totalCopies}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">{label}</p>
                    <p className="mt-2 text-sm font-medium text-[rgb(var(--text))]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => (selected ? removeBook(book.id) : addBook(book))}>
                  {selected ? 'Remover da seleção' : 'Adicionar à seleção'}
                </Button>
                <Link to="/appointments">
                  <Button variant="secondary">Ir para agendamento</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-sm font-semibold text-[rgb(var(--text))]">Antes de agendar</p>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                O sistema registra o horário e os livros escolhidos para dar visibilidade prévia ao bibliotecário. O
                empréstimo físico continua sendo feito 100% presencial.
              </p>
              <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 text-sm text-[rgb(var(--muted))]">
                {selectedBooks.length} livro{selectedBooks.length === 1 ? '' : 's'} já estão na sua seleção.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
