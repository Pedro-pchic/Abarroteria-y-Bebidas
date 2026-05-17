import { Link } from 'react-router-dom'

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#caracteristicas', label: 'Características' },
  { href: '#modulos', label: 'Módulos' },
  { href: '#contacto', label: 'Contacto' },
]

export default function LandingNavbar() {
  return (
    <header className="landing-navbar">
      <div className="landing-shell landing-navbar-inner">
        <a href="#inicio" className="landing-brand">
          <span className="landing-brand-mark" aria-hidden="true">BA</span>
          <span>Sistema de Gestión Integral</span>
        </a>

        <nav className="landing-links" aria-label="Navegación principal">
          {links.map(({ href, label }) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <Link to="/login" className="landing-button landing-button-sm">
          Iniciar Sesión
        </Link>
      </div>
    </header>
  )
}
