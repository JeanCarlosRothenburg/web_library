import { Outlet } from 'react-router-dom'
import { SiteHeader } from './site-header'

export function SiteLayout() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="app-main page-shell space-y-10 py-8 md:py-10">
        <Outlet />
      </main>
      <footer className="page-shell pb-10 pt-2 text-sm text-[rgb(var(--muted))]">
        Sistema de agendamento presencial de retirada. O empréstimo físico ocorre apenas na biblioteca.
      </footer>
    </div>
  )
}

