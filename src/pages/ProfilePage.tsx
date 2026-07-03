import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../hooks/useAuth'

export function ProfilePage() {
  const { user, updateProfile, signOut } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      return
    }

    setFullName(user.fullName)
    setPhone(user.phone)
    setAvatarUrl(user.avatarUrl)
  }, [user])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await updateProfile({ fullName, phone, avatarUrl })
      setMessage('Perfil atualizado com sucesso.')
    } catch (profileError) {
      setMessage(profileError instanceof Error ? profileError.message : 'Não foi possível atualizar o perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Minha conta</CardTitle>
          <CardDescription>Dados usados para o agendamento presencial.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5">
            <p className="text-sm font-semibold text-[rgb(var(--text))]">{user.fullName}</p>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">{user.email}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[rgb(var(--accent))]">{user.role}</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="profile-name">
                Nome completo
              </label>
              <Input id="profile-name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="profile-phone">
                Telefone
              </label>
              <Input id="profile-phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="profile-avatar">
                Avatar URL
              </label>
              <Input id="profile-avatar" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} />
            </div>
            {message ? <p className="text-sm text-[rgb(var(--muted))]">{message}</p> : null}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => void signOut()}>
                Sair da conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visão geral</CardTitle>
          <CardDescription>Informações rápidas sobre o uso do sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            ['Agendamentos', 'Acompanhe suas reservas na página de agendamentos.'],
            ['Retirada', 'O empréstimo físico continua sendo feito 100% presencial.'],
            ['Seleção', 'Você pode escolher um ou mais livros antes de agendar.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5">
              <p className="text-sm font-semibold text-[rgb(var(--text))]">{title}</p>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">{text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
