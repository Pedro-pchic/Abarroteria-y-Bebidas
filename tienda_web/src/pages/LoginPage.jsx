import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createUsuario } from '../services/usuarioService'

const LOGIN_FORM = { username: '', password: '' }
const REGISTER_FORM = { username: '', password: '', confirmPassword: '' }

export default function LoginPage() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [mode, setMode]       = useState('login')
  const [form, setForm]       = useState(LOGIN_FORM)
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const isRegisterMode = mode === 'register'

  const switchMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'))
    setForm(mode === 'login' ? REGISTER_FORM : LOGIN_FORM)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password) {
      setError('Completa todos los campos.')
      return
    }
    if (isRegisterMode && form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (isRegisterMode && form.password.trim().length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      if (isRegisterMode) {
        await createUsuario({
          username: form.username.trim(),
          password: form.password,
        })
        setSuccess('Usuario creado correctamente. Ya puedes iniciar sesión.')
        setMode('login')
        setForm({ username: form.username.trim(), password: '' })
        return
      }

      await login(form.username.trim(), form.password)
      navigate('/clientes')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (isRegisterMode ? 'No se pudo crear el usuario.' : 'Usuario o contraseña incorrectos.')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="form-card login-card">
        <h1 className="page-title login-title">TiendaApp</h1>
        <p className="page-subtitle login-subtitle">
          {isRegisterMode ? 'Crea tu usuario para ingresar' : 'Inicia sesión para continuar'}
        </p>

        {success && (
          <div className="alert alert-success" style={{ marginBottom:'1rem' }}>
            <span className="alert-icon">✓</span>
            <p>{success}</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom:'1rem' }}>
            <span className="alert-icon">⚠</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              className="form-input"
              placeholder="tu_usuario"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoFocus
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              disabled={loading}
            />
          </div>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                disabled={loading}
              />
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? (isRegisterMode ? 'Creando...' : 'Entrando...')
              : (isRegisterMode ? 'Crear usuario' : 'Entrar')}
          </button>
        </form>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={switchMode}
          disabled={loading}
        >
          {isRegisterMode ? 'Ya tengo usuario' : 'No tengo usuario, crear cuenta'}
        </button>
      </div>
    </div>
  )
}
