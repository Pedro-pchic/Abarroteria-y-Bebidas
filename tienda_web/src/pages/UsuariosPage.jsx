import { useCallback, useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { createUsuario, deleteUsuario, getUsuarios } from '../services/usuarioService'

const FORM_INICIAL = { username: '', password: '' }

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(FORM_INICIAL)
  const [errores, setErrores] = useState(FORM_INICIAL)
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)

  const cargarUsuarios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getUsuarios()
      setUsuarios(data)
    } catch (err) {
      setError('No se pudieron cargar los usuarios.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarUsuarios()
  }, [cargarUsuarios])

  const validar = () => {
    const nuevosErrores = { username: '', password: '' }
    let valido = true

    if (!form.username.trim()) {
      nuevosErrores.username = 'El usuario es obligatorio.'
      valido = false
    }

    if (!form.password.trim()) {
      nuevosErrores.password = 'La contraseña es obligatoria.'
      valido = false
    } else if (form.password.trim().length < 4) {
      nuevosErrores.password = 'La contraseña debe tener al menos 4 caracteres.'
      valido = false
    }

    setErrores(nuevosErrores)
    return valido
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    try {
      setSaving(true)
      const nuevoUsuario = await createUsuario({
        username: form.username.trim(),
        password: form.password,
      })
      setUsuarios((prev) => [nuevoUsuario, ...prev])
      setForm(FORM_INICIAL)
      setErrores(FORM_INICIAL)
      setToast({ message: 'Usuario creado correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo guardar el usuario.', type: 'error' })
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!usuarioAEliminar) return

    try {
      await deleteUsuario(usuarioAEliminar.id)
      setUsuarios((prev) => prev.filter((item) => item.id !== usuarioAEliminar.id))
      setToast({ message: 'Usuario eliminado correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo eliminar el usuario.', type: 'error' })
      console.error(err)
    } finally {
      setUsuarioAEliminar(null)
    }
  }

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.username?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {usuarioAEliminar && (
        <ConfirmDialog
          message={`¿Eliminar al usuario "${usuarioAEliminar.username}"?`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setUsuarioAEliminar(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Usuarios</h1>
          <p className="page-subtitle">Administra las cuentas que ingresan al sistema.</p>
        </div>
      </div>

      <div className="management-grid">
        <section className="form-card">
          <div className="panel-heading">
            <h2 className="panel-title">Nuevo usuario</h2>
            <p className="panel-copy">Crea accesos para caja, bodega o administracion.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="usuario-username">Nombre de usuario</label>
              <input
                id="usuario-username"
                name="username"
                className={`form-input ${errores.username ? 'input-error' : ''}`}
                placeholder="cajero1"
                value={form.username}
                onChange={handleChange}
                disabled={saving}
              />
              {errores.username && <span className="form-error">{errores.username}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="usuario-password">Contraseña</label>
              <input
                id="usuario-password"
                type="password"
                name="password"
                className={`form-input ${errores.password ? 'input-error' : ''}`}
                placeholder="••••••"
                value={form.password}
                onChange={handleChange}
                disabled={saving}
              />
              {errores.password && <span className="form-error">{errores.password}</span>}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : '+ Guardar usuario'}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre de usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="search-clear" onClick={() => setBusqueda('')}>×</button>
            )}
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠</span>
              <div>
                <strong>Error</strong>
                <p>{error}</p>
                <button className="btn btn-ghost" onClick={cargarUsuarios}>Reintentar</button>
              </div>
            </div>
          )}

          {!error && (
            <div className="table-container">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Cargando usuarios...</p>
                </div>
              ) : usuariosFiltrados.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{busqueda ? '⌕' : '◈'}</div>
                  <h3>{busqueda ? 'Sin resultados' : 'Sin usuarios registrados'}</h3>
                  <p>{busqueda ? 'Prueba con otro nombre de usuario.' : 'Crea la primera cuenta para operar la tienda.'}</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Usuario</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario, index) => (
                      <tr key={usuario.id} className="table-row">
                        <td className="td-number">{index + 1}</td>
                        <td className="td-name">{usuario.username}</td>
                        <td className="td-actions">
                          <button className="btn btn-danger" onClick={() => setUsuarioAEliminar(usuario)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default UsuariosPage
