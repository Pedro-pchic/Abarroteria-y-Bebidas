import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LOGIN_FORM = { username: '', password: '' }

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(LOGIN_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const username = form.username.trim()
    const password = form.password

    if (!username) {
      setError('Ingresa tu usuario.')
      return
    }

    if (!password) {
      setError('Ingresa tu contraseña.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await login(username, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (!err.response) {
        setError('No se pudo conectar con el servidor. Intenta nuevamente.')
        return
      }

      setError('Usuario o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-shell" aria-label="Acceso interno">
        <div className="login-brand-panel">
          <Link to="/" className="login-store-link">
            Volver a la tienda
          </Link>
          <span className="login-kicker">Área privada para colaboradores</span>
          <h1>Acceso al Sistema</h1>
          <p>
            Ingresa con tu usuario autorizado para administrar Bebidas y Abarrotes S.A.
          </p>
          <div className="login-support-box">
            <strong>Bebidas y Abarrotes S.A.</strong>
            <span>Gestión interna de clientes, inventario, ventas y reportes.</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <span className="login-card-mark" aria-hidden="true">BA</span>
            <div>
              <h2>Ingreso autorizado</h2>
              <p>Usa las credenciales asignadas por administración.</p>
            </div>
          </div>

          {error && (
            <div className="login-alert" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-username">Usuario</label>
              <input
                id="login-username"
                name="username"
                className="form-input"
                placeholder="admin"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
              {loading ? 'Validando acceso...' : 'Ingresar al dashboard'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
