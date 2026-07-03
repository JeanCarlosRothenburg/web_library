import { Link } from 'react-router-dom'
import { BookCarousel } from '../components/book-carousel'
import { SectionHeading } from '../components/section-heading'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useSelection } from '../context/selection-context'
import { useBooks } from '../hooks/useBooks'

export function HomePage() {
  const { newestBooks, popularBooks, loading } = useBooks()
  const { selectedBooks, addBook, removeBook } = useSelection()
  const selectedIds = new Set(selectedBooks.map((book) => book.id))

  return (
    <div className="space-y-12">
      <section className="hero-surface overflow-hidden">
        <div className="grid gap-10 p-8 md:grid-cols-[1.15fr_0.85fr] md:p-12">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-2 text-sm font-medium text-[rgb(var(--accent))]">
              Biblioteca Municipal Getúlio Vargas
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[rgb(var(--text))] md:text-6xl">
                Consulta de acervo e agendamento presencial em um único fluxo.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[rgb(var(--muted))] md:text-lg">
                Escolha seus livros, reserve um horário e chegue com tudo pronto para a retirada presencial. O sistema
                não realiza empréstimo online.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/books">
                <Button size="lg">Explorar acervo</Button>
              </Link>
              <Link to="/appointments">
                <Button size="lg" variant="secondary">
                  Ver agendamentos
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Acervo digital', 'Consulta rápida e organizada.'],
                ['Agendamento', 'Selecione livros e horário.'],
                ['Atendimento', 'Retirada sempre presencial.'],
              ].map(([title, description]) => (
                <Card key={title}>
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold text-[rgb(var(--text))]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[rgb(var(--muted))]">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="space-y-5 p-6">
                <SectionHeading
                  eyebrow="Anúncio"
                  title="Workshop de leitura e mediação cultural"
                  description="Um encontro aberto para leitores, professores e famílias, com dicas de mediação, roda de conversa e espaço para perguntas."
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Data', '12 de agosto de 2026'],
                    ['Horário', '19h às 20h30'],
                    ['Local', 'Sala principal da biblioteca'],
                    ['Entrada', 'Gratuita mediante inscrição'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">{label}</p>
                      <p className="mt-2 text-sm font-medium text-[rgb(var(--text))]">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-6">
                <p className="text-sm font-semibold text-[rgb(var(--text))]">Resumo rápido</p>
                <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                  {selectedBooks.length} livro{selectedBooks.length === 1 ? '' : 's'} estão na sua seleção. Use a
                  página de agendamentos para definir data e horário.
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedBooks.slice(0, 2).map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => removeBook(book.id)}
                      className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-1 text-xs text-[rgb(var(--text))]"
                    >
                      {book.title}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Coleções"
          title="Livros novos"
          description="Seleção recente do acervo da biblioteca."
        />
        {loading ? (
          <p className="text-sm text-[rgb(var(--muted))]">Carregando livros...</p>
        ) : (
          <BookCarousel
            title="Lançamentos"
            books={newestBooks.slice(0, 6)}
            onToggleSelection={(book) => (selectedIds.has(book.id) ? removeBook(book.id) : addBook(book))}
            selectedIds={selectedIds}
          />
        )}
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Preferidos"
          title="Mais procurados"
          description="Os títulos com maior movimentação e interesse do público."
        />
        <BookCarousel
          title="Mais procurados"
          books={popularBooks.slice(0, 6)}
          onToggleSelection={(book) => (selectedIds.has(book.id) ? removeBook(book.id) : addBook(book))}
          selectedIds={selectedIds}
        />
      </section>
    </div>
  )
}

