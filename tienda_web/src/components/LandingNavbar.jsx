import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/bebidas', label: 'Bebidas' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/contacto', label: 'Contacto' },
]

export default function LandingNavbar() {
  return (
    <header className="landing-navbar">
      <div className="landing-shell landing-navbar-inner">
        <Link to="/" className="landing-brand">
          <span className="landing-brand-mark" aria-hidden="true">BA</span>
          <span>Bebidas y Abarrotes S.A.</span>
        </Link>

        <nav className="landing-links" aria-label="Navegacion publica">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Link to="/login" className="landing-button landing-button-sm">
          Acceso al Sistema
        </Link>
      </div>
    </header>
  )
}
