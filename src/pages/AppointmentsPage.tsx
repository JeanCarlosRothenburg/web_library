import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { SectionHeading } from '../components/section-heading'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { useSelection } from '../context/selection-context'
import { formatDateTime } from '../lib/utils'
import { useAppointments } from '../hooks/useAppointments'
import { useAuth } from '../hooks/useAuth'

export function AppointmentsPage() {
  const { user } = useAuth()
  const { selectedBooks, removeBook, clearSelection } = useSelection()
  const { appointments, loading, error, createAppointment, statusLabel } = useAppointments(user?.id)
  
  // Estados do formulário
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [mockRenewals, setMockRenewals] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!user) return
    setContactName(user.fullName)
    setContactPhone(user.phone)
  }, [user])

  const scheduledFor = useMemo(() => {
    if (!date || !time) return ''
    return new Date(`${date}T${time}:00`).toISOString()
  }, [date, time])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      await createAppointment({
        scheduledFor,
        contactName,
        contactPhone,
        notes,
        books: selectedBooks,
      })

      clearSelection()
      setDate('')
      setTime('')
      setNotes('')
      setMessage('Agendamento criado com sucesso.')
    } catch (appointmentError) {
      setMessage(appointmentError instanceof Error ? appointmentError.message : 'Não foi possível criar o agendamento.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRenew = (appointmentId: string) => {
    setMockRenewals((prev) => ({
      ...prev,
      [appointmentId]: (prev[appointmentId] || 0) + 1,
    }))
    alert('Sucesso! Prazo de devolução renovado por mais 7 dias.')
  }

  const activeAppointments = appointments.filter(
    (app) => !['completed', 'returned', 'devolvido', 'concluido'].includes(app.status?.toLowerCase() || '')
  )
  const historicalAppointments = appointments.filter(
    (app) => ['completed', 'returned', 'devolvido', 'concluido'].includes(app.status?.toLowerCase() || '')
  )

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Agendamentos"
        title="Reserve seu horário de retirada"
        description="Escolha um ou mais livros, informe os dados de contato e selecione o dia e horário da visita presencial."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        
        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[rgb(var(--text))]">Livros selecionados</p>
                <p className="text-sm text-[rgb(var(--muted))]">{selectedBooks.length} item(ns) prontos para agendar</p>
              </div>
              <Link to="/books">
                <Button variant="secondary">Adicionar mais livros</Button>
              </Link>
            </div>

            <div className="space-y-3">
              {selectedBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between gap-3 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[rgb(var(--text))]">{book.title}</p>
                    <p className="text-sm text-[rgb(var(--muted))]">{book.author}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBook(book.id)}
                    className="text-sm font-medium text-[rgb(var(--accent))]"
                  >
                    Remover
                  </button>
                </div>
              ))}
              {selectedBooks.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[rgb(var(--border))] p-6 text-center">
                  <p className="text-sm font-medium text-[rgb(var(--text))]">Nenhum livro selecionado</p>
                  <p className="mt-2 text-sm text-[rgb(var(--muted))]">Vá ao acervo e adicione os livros desejados.</p>
                </div>
              ) : null}
            </div>

            <form className="grid gap-4 pt-2" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="appointment-date">
                    Data
                  </label>
                  <Input id="appointment-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="appointment-time">
                    Horário
                  </label>
                  <Input id="appointment-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="appointment-name">
                    Nome para contato
                  </label>
                  <Input id="appointment-name" value={contactName} onChange={(event) => setContactName(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="appointment-phone">
                    Telefone
                  </label>
                  <Input id="appointment-phone" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="appointment-notes">
                  Observações
                </label>
                <Textarea
                  id="appointment-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Ex.: retirar no balcão principal, preferência por confirmação por mensagem."
                />
              </div>
              {message ? <p className="text-sm text-emerald-600 font-medium">{message}</p> : null}
              <Button type="submit" disabled={submitting || selectedBooks.length === 0 || !scheduledFor}>
                {submitting ? 'Agendando...' : 'Confirmar agendamento'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[rgb(var(--text))]">Agendamentos Ativos</p>
                  <p className="text-sm text-[rgb(var(--muted))]">Suas próximas visitas à biblioteca.</p>
                </div>
                <Badge variant="outline">{activeAppointments.length} ativo(s)</Badge>
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              {loading ? <p className="text-sm text-[rgb(var(--muted))]">Carregando agendamentos...</p> : null}

              <div className="space-y-4">
                {activeAppointments.map((appointment) => {
                  const renewalsCount = mockRenewals[appointment.id] || 0;

                  return (
                    <div key={appointment.id} className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5 transition hover:shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[rgb(var(--text))]">{formatDateTime(appointment.scheduledFor)}</p>
                          <p className="text-sm text-[rgb(var(--muted))]">{appointment.contactName}</p>
                        </div>
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                          {statusLabel(appointment.status)}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-3">
                        {appointment.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[rgb(var(--surface))] p-3">
                            <div>
                              <p className="text-sm font-medium text-[rgb(var(--text))]">{item.book.title}</p>
                              <p className="text-sm text-[rgb(var(--muted))]">{item.book.author}</p>
                            </div>
                            <span className="text-xs text-[rgb(var(--muted))]">#{item.position}</span>
                          </div>
                        ))}
                      </div>
                      
                      {appointment.notes ? <p className="mt-3 text-sm text-[rgb(var(--muted))]">Obs: {appointment.notes}</p> : null}

                      <div className="mt-4 pt-4 border-t border-[rgb(var(--border))]">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[rgb(var(--muted))]">
                            {renewalsCount > 0 ? `Renovado ${renewalsCount} vez(es)` : 'Prazo regular'}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRenew(appointment.id)}
                            disabled={renewalsCount >= 2}
                            className="text-xs"
                          >
                            {renewalsCount >= 2 ? 'Limite atingido' : 'Renovar (+7 dias)'}
                          </Button>
                        </div>
                      </div>

                    </div>
                  )
                })}

                {!loading && activeAppointments.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[rgb(var(--border))] p-6 text-center">
                    <p className="text-sm font-medium text-[rgb(var(--text))]">Nenhum agendamento ativo</p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-sm font-semibold text-[rgb(var(--text))]">Histórico de Leituras</p>
                <p className="text-sm text-[rgb(var(--muted))]">Livros que você já concluiu e devolveu.</p>
              </div>
              
              {historicalAppointments.length === 0 ? (
                <p className="text-sm text-[rgb(var(--muted))] italic">Nenhum histórico disponível ainda.</p>
              ) : (
                <div className="divide-y divide-[rgb(var(--border))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
                  {historicalAppointments.map((app) => (
                    <div key={app.id} className="p-3 bg-[rgb(var(--surface-2))] opacity-80 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[rgb(var(--muted))]">{formatDateTime(app.scheduledFor)}</span>
                        <Badge variant="secondary" className="text-[10px]">Concluído</Badge>
                      </div>
                      {app.items.map((item) => (
                        <p key={item.id} className="text-sm font-medium text-[rgb(var(--text))]">• {item.book.title}</p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}