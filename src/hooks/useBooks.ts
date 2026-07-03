import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { mockBooks } from '../lib/mock-data'
import type { Book } from '../types/app'

type BooksState = {
  books: Book[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getBookByCodigoLivro: (codigoLivro: string) => Book | undefined
  newestBooks: Book[]
  popularBooks: Book[]
}

function mapBook(row: Record<string, any>): Book {
  return {
    id: row.id,
    codigoLivro: row.codigo_livro,
    title: row.title,
    author: row.author,
    synopsis: row.synopsis,
    genre: row.genre ?? 'Geral',
    language: row.language ?? 'Português',
    publishedYear: row.published_year ?? new Date(row.created_at ?? Date.now()).getFullYear(),
    pages: row.pages ?? 0,
    totalCopies: row.total_copies ?? 0,
    availableCopies: row.available_copies ?? 0,
    popularityScore: row.popularity_score ?? 0,
    featuredRank: row.featured_rank ?? 9999,
    coverUrl: row.cover_url ?? null,
    createdAt: row.created_at ?? new Date().toISOString(),
  }
}

export function useBooks(): BooksState {
  const [books, setBooks] = useState<Book[]>(mockBooks)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    if (!supabase) {
      setBooks(mockBooks)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from('books')
      .select('*')
      .order('featured_rank', { ascending: true })
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
      setBooks(mockBooks)
    } else {
      setBooks((data ?? []).map(mapBook))
    }

    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const newestBooks = useMemo(
    () => [...books].sort((left, right) => +new Date(right.createdAt) - +new Date(left.createdAt)),
    [books],
  )

  const popularBooks = useMemo(
    () => [...books].sort((left, right) => right.popularityScore - left.popularityScore),
    [books],
  )

  const getBookByCodigoLivro = (codigoLivro: string) =>
    books.find((book) => book.codigoLivro === codigoLivro)

  return {
    books,
    loading,
    error,
    refresh,
    getBookByCodigoLivro,
    newestBooks,
    popularBooks,
  }
}

