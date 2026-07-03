export type ThemeMode = 'light' | 'dark'

export type Book = {
  id: string
  codigoLivro: string
  title: string
  author: string
  synopsis: string
  genre: string
  language: string
  publishedYear: number
  pages: number
  totalCopies: number
  availableCopies: number
  popularityScore: number
  featuredRank: number
  coverUrl?: string | null
  createdAt: string
}

export type BookSummary = Pick<
  Book,
  'id' | 'codigoLivro' | 'title' | 'author' | 'coverUrl' | 'availableCopies' | 'totalCopies'
>

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'canceled'

export type AppointmentItem = {
  id: string
  appointmentId: string
  book: BookSummary
  position: number
}

export type Appointment = {
  id: string
  scheduledFor: string
  status: AppointmentStatus
  contactName: string
  contactPhone: string
  notes: string
  createdAt: string
  items: AppointmentItem[]
}

export type Profile = {
  id: string
  email: string
  fullName: string
  phone: string
  avatarUrl: string
  role: 'reader' | 'librarian'
}

export type AuthIdentity = Profile & {
  isDemo?: boolean
}

