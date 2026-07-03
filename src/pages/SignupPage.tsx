import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { useAuth } from '../hooks/useAuth'

export function SignupPage() {
  const { user, signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
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
      await signUp({ fullName, email, password })
      navigate('/profile')
    } catch (signUpError) {
      setError(signUpError instanceof Error ? signUpError.message : 'Não foi possível criar o cadastro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4 rounded-[32px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent))]">Cadastro</p>
        <h1 className="text-4xl font-semibold tracking-tight text-[rgb(var(--text))]">Crie sua conta para agendar retiradas.</h1>
        <p className="text-sm leading-7 text-[rgb(var(--muted))]">
          O cadastro identifica o leitor e permite que o bibliotecário tenha visibilidade antecipada dos livros e do
          horário de comparecimento.
        </p>
      </div>

      <Card className="self-start">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Preencha com seus dados para começar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="full-name">
                Nome completo
              </label>
              <Input id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="signup-email">
                E-mail
              </label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgb(var(--text))]" htmlFor="signup-password">
                Senha
              </label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando...' : 'Criar conta'}
            </Button>
            <p className="text-sm text-[rgb(var(--muted))]">
              Já possui cadastro? <Link to="/login" className="font-medium text-[rgb(var(--accent))]">Entrar</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
