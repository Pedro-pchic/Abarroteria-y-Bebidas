import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Completa todos los campos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/clientes')
    } catch (err) {
      setError(err.response?.data?.message || 'Usuario o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
                  justifyContent:'center', background:'#f3f4f6' }}>
      <div className="form-card" style={{ width:'100%', maxWidth:'400px' }}>
        <h1 className="page-title">🛒 TiendaApp</h1>
        <p className="page-subtitle" style={{ marginBottom:'1.5rem' }}>
          Inicia sesión para continuar
        </p>

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
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width:'100%', marginTop:'1rem' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}