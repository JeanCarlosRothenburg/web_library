import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/profile" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn({ email, password })
      navigate('/profile')
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4 rounded-[32px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent))]">Acesso</p>
        <h1 className="text-4xl font-semibold tracking-tight text-[rgb(var(--text))]">Entre para gerenciar seus agendamentos.</h1>
        <p className="text-sm leading-7 text-[rgb(var(--muted))]">
          Faça login para visualizar seus horários, atualizar seu perfil e confirmar a seleção de livros para retirada
          presencial.
        </p>
      </div>

      <Card className="self-start">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Use seu e-mail cadastrado na biblioteca.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="email">
                E-mail
              </label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="password">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <p className="text-sm text-[rgb(var(--muted))]">
              Ainda não tem cadastro? <Link to="/signup" className="font-medium text-[rgb(var(--accent))]">Criar conta</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
