import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { mockAppointments } from '../lib/mock-data'
import type { Appointment, AppointmentStatus, Book } from '../types/app'

type AppointmentInput = {
  scheduledFor: string
  contactName: string
  contactPhone: string
  notes: string
  books: Book[]
}

type AppointmentRow = {
  id: string
  scheduled_for: string
  status: AppointmentStatus
  contact_name: string
  contact_phone: string | null
  notes: string | null
  created_at: string
}

type AppointmentItemRow = {
  id: string
  appointment_id: string
  book_id: string
  book_code: string
  title_snapshot: string
  author_snapshot: string
  position: number
}

const storageKey = 'bgv-appointments'

function readLocalAppointments(): Appointment[] {
  if (typeof window === 'undefined') {
    return []
  }

  const stored = window.localStorage.getItem(storageKey)
  if (!stored) {
    return mockAppointments
  }

  try {
    return JSON.parse(stored) as Appointment[]
  } catch {
    return mockAppointments
  }
}

function writeLocalAppointments(appointments: Appointment[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(appointments))
}

function statusLabel(status: AppointmentStatus) {
  switch (status) {
    case 'pending':
      return 'Pendente'
    case 'confirmed':
      return 'Confirmado'
    case 'completed':
      return 'Concluído'
    case 'canceled':
      return 'Cancelado'
  }
}

export function useAppointments(userId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [loading, setLoading] = useState(Boolean(supabase && userId))
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    if (!userId) {
      setAppointments([])
      setLoading(false)
      return
    }

    if (!supabase) {
      const localAppointments = readLocalAppointments()
      setAppointments(localAppointments)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const db = supabase as any
    const [appointmentsResult, itemsResult] = await Promise.all([
      db.from('appointments').select('*').eq('user_id', userId).order('scheduled_for', { ascending: true }),
      db.from('appointment_items').select('*').order('position', { ascending: true }),
    ])

    if (appointmentsResult.error) {
      setError(appointmentsResult.error.message)
      setAppointments([])
      setLoading(false)
      return
    }

    if (itemsResult.error) {
      setError(itemsResult.error.message)
      setAppointments([])
      setLoading(false)
      return
    }

    const appointmentsData = (appointmentsResult.data ?? []) as AppointmentRow[]
    const itemsData = (itemsResult.data ?? []) as AppointmentItemRow[]

    const mappedAppointments = appointmentsData.map((appointment) => ({
      id: appointment.id,
      scheduledFor: appointment.scheduled_for,
      status: appointment.status,
      contactName: appointment.contact_name,
      contactPhone: appointment.contact_phone ?? '',
      notes: appointment.notes ?? '',
      createdAt: appointment.created_at,
      items: itemsData
        .filter((item) => item.appointment_id === appointment.id)
        .map((item) => ({
          id: item.id,
          appointmentId: item.appointment_id,
          book: {
            id: item.book_id,
            codigoLivro: item.book_code,
            title: item.title_snapshot,
            author: item.author_snapshot,
            coverUrl: null,
            availableCopies: 0,
            totalCopies: 0,
          },
          position: item.position,
        })),
    }))

    setAppointments(mappedAppointments)
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [userId])

  const createAppointment = async (input: AppointmentInput) => {
    if (!userId) {
      throw new Error('Entre com sua conta para agendar a retirada.')
    }

    if (input.books.length === 0) {
      throw new Error('Selecione pelo menos um livro antes de agendar.')
    }

    if (!supabase) {
      const nextAppointment: Appointment = {
        id: crypto.randomUUID(),
        scheduledFor: input.scheduledFor,
        status: 'pending',
        contactName: input.contactName,
        contactPhone: input.contactPhone,
        notes: input.notes,
        createdAt: new Date().toISOString(),
        items: input.books.map((book, index) => ({
          id: crypto.randomUUID(),
          appointmentId: '',
          position: index + 1,
          book: {
            id: book.id,
            codigoLivro: book.codigoLivro,
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl ?? null,
            availableCopies: book.availableCopies,
            totalCopies: book.totalCopies,
          },
        })),
      }

      nextAppointment.items = nextAppointment.items.map((item) => ({
        ...item,
        appointmentId: nextAppointment.id,
      }))

      const updatedAppointments = [nextAppointment, ...readLocalAppointments()]
      setAppointments(updatedAppointments)
      writeLocalAppointments(updatedAppointments)
      return nextAppointment
    }

    const appointmentPayload = {
      user_id: userId,
      scheduled_for: input.scheduledFor,
      contact_name: input.contactName,
      contact_phone: input.contactPhone,
      notes: input.notes,
      status: 'pending' as const,
    }

    const db = supabase as any
    const appointmentResult = await db.from('appointments').insert(appointmentPayload).select('*').single()

    if (appointmentResult.error) {
      throw new Error(appointmentResult.error.message)
    }

    const itemsPayload = input.books.map((book, index) => ({
      appointment_id: appointmentResult.data.id,
      book_id: book.id,
      book_code: book.codigoLivro,
      title_snapshot: book.title,
      author_snapshot: book.author,
      position: index + 1,
    }))

    const itemsResult = await db.from('appointment_items').insert(itemsPayload)

    if (itemsResult.error) {
      throw new Error(itemsResult.error.message)
    }

    await refresh()
    return appointmentResult.data.id
  }

  return {
    appointments,
    loading,
    error,
    refresh,
    createAppointment,
    statusLabel,
  }
}
