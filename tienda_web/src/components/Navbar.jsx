import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/clientes', label: 'Clientes' },
  { to: '/productos-admin', label: 'Productos' },
  { to: '/proveedores', label: 'Proveedores' },
  { to: '/ventas', label: 'Ventas' },
  { to: '/compras', label: 'Compras' },
  { to: '/facturas', label: 'Facturas' },
  { to: '/pagos', label: 'Pagos' },
]

function Navbar() {
  const { logout, user, isAdmin } = useAuth()
  const visibleLinks = isAdmin
    ? [...links, { to: '/reportes', label: 'Reportes' }, { to: '/usuarios', label: 'Usuarios' }]
    : links

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/dashboard" className="navbar-brand">
          <span className="brand-icon" aria-hidden="true">BA</span>
          <span className="brand-copy">
            <strong>Bebidas y Abarrotes S.A.</strong>
            <small>Gestión interna</small>
          </span>
        </NavLink>

        <nav className="navbar-links">
          {visibleLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-user">
          <span className="navbar-user-label" title="Usuario activo">
            <strong>{user?.username || 'Sesion activa'}</strong>
            {user?.role && <small>{user.role}</small>}
          </span>
          <button className="btn btn-ghost navbar-logout" onClick={logout}>
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
