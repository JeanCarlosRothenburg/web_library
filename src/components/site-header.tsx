
import logoPg from '../assets/logo-pg.svg'
import { NavLink } from 'react-router-dom'
import { useSelection } from '../context/selection-context'
import { useTheme } from '../context/theme-context'
import { useAuth } from '../hooks/useAuth'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const navItems = [
  { to: '/', label: 'Início' },
  { to: '/books', label: 'Acervo' },
  { to: '/appointments', label: 'Agendamentos' },
  { to: '/profile', label: 'Perfil' },
]

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2.5 12h2.5M19 12h2.5M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 14.3A8.5 8.5 0 1 1 9.7 4 7 7 0 0 0 20 14.3Z" />
    </svg>
  )
}

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const { selectedCount } = useSelection()

  return (
    <header className="app-header">
      <div className="page-shell flex min-h-[88px] items-center justify-between gap-4 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logoPg} alt="Logo da Biblioteca Getúlio Vargas" className="size-11 object-contain" />

          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-[0.18em] text-[rgb(var(--accent))]">Biblioteca</p>
            <p className="text-base font-semibold text-[rgb(var(--text))]">Getúlio Vargas</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-1 shadow-sm md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-[rgb(var(--primary))] text-[rgb(var(--text))]'
                    : 'text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))]',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden md:inline-flex">
            {selectedCount} selecionado{selectedCount === 1 ? '' : 's'}
          </Badge>
          <Button variant="secondary" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </Button>
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <NavLink to="/profile">
                <Button variant="outline" size="sm">
                  {user.fullName.split(' ')[0]}
                </Button>
              </NavLink>
              <Button variant="ghost" size="sm" onClick={() => void signOut()}>
                Sair
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <NavLink to="/login">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </NavLink>
              <NavLink to="/signup">
                <Button size="sm">Cadastrar</Button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
