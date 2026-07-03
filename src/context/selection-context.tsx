import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Book } from '../types/app'

type SelectionContextValue = {
  selectedBooks: Book[]
  selectedCount: number
  addBook: (book: Book) => void
  removeBook: (bookId: string) => void
  clearSelection: () => void
  isSelected: (bookId: string) => boolean
}

const SelectionContext = createContext<SelectionContextValue | null>(null)
const storageKey = 'bgv-selected-books'

function readSelection(): Book[] {
  if (typeof window === 'undefined') {
    return []
  }

  const stored = window.localStorage.getItem(storageKey)
  if (!stored) {
    return []
  }

  try {
    return JSON.parse(stored) as Book[]
  } catch {
    return []
  }
}

export function SelectionProvider({ children }: PropsWithChildren) {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>(readSelection)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(selectedBooks))
  }, [selectedBooks])

  const value = useMemo<SelectionContextValue>(
    () => ({
      selectedBooks,
      selectedCount: selectedBooks.length,
      addBook: (book) =>
        setSelectedBooks((current) =>
          current.some((item) => item.id === book.id) ? current : [...current, book],
        ),
      removeBook: (bookId) =>
        setSelectedBooks((current) => current.filter((item) => item.id !== bookId)),
      clearSelection: () => setSelectedBooks([]),
      isSelected: (bookId) => selectedBooks.some((item) => item.id === bookId),
    }),
    [selectedBooks],
  )

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useSelection() {
  const context = useContext(SelectionContext)

  if (!context) {
    throw new Error('useSelection must be used within SelectionProvider')
  }

  return context
}

