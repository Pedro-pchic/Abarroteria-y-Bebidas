import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/clientes', label: 'Clientes' },
  { to: '/productos', label: 'Productos' },
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
        <NavLink to="/clientes" className="navbar-brand">
          <span className="brand-icon" aria-hidden="true">🥤</span>
          <span>Tienda Central</span>
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
          <span className="navbar-user-label">
            {user?.username ? `@${user.username}${user?.role ? ` · ${user.role}` : ''}` : 'Sesion activa'}
          </span>
          <button className="btn btn-ghost" onClick={logout}>
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
