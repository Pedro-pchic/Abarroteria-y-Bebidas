import { useCallback, useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import {
  createProveedor,
  deleteProveedor,
  getProveedores,
} from '../services/proveedorService'

const FORM_INICIAL = { nombre: '', telefono: '' }

function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([])
  const [form, setForm] = useState(FORM_INICIAL)
  const [errores, setErrores] = useState(FORM_INICIAL)
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null)

  const cargarProveedores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProveedores()
      setProveedores(data)
    } catch (err) {
      setError('No se pudieron cargar los proveedores.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarProveedores()
  }, [cargarProveedores])

  const validar = () => {
    const nuevosErrores = { nombre: '', telefono: '' }
    let valido = true

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.'
      valido = false
    }

    if (!form.telefono.trim()) {
      nuevosErrores.telefono = 'El telefono es obligatorio.'
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
      const nuevoProveedor = await createProveedor({
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
      })

      setProveedores((prev) => [nuevoProveedor, ...prev])
      setForm(FORM_INICIAL)
      setErrores(FORM_INICIAL)
      setToast({ message: 'Proveedor registrado correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo guardar el proveedor.', type: 'error' })
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!proveedorAEliminar) return

    try {
      await deleteProveedor(proveedorAEliminar.id)
      setProveedores((prev) => prev.filter((item) => item.id !== proveedorAEliminar.id))
      setToast({ message: 'Proveedor eliminado correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo eliminar el proveedor.', type: 'error' })
      console.error(err)
    } finally {
      setProveedorAEliminar(null)
    }
  }

  const proveedoresFiltrados = proveedores.filter((proveedor) =>
    proveedor.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    proveedor.telefono?.includes(busqueda)
  )

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {proveedorAEliminar && (
        <ConfirmDialog
          message={`¿Eliminar al proveedor "${proveedorAEliminar.nombre}"?`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setProveedorAEliminar(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Proveedores</h1>
          <p className="page-subtitle">Registra y administra los contactos de abastecimiento.</p>
        </div>
      </div>

      <div className="management-grid">
        <section className="form-card">
          <div className="panel-heading">
            <h2 className="panel-title">Nuevo proveedor</h2>
            <p className="panel-copy">Guarda el contacto base para futuras compras.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="nombre-proveedor">Nombre</label>
              <input
                id="nombre-proveedor"
                name="nombre"
                className={`form-input ${errores.nombre ? 'input-error' : ''}`}
                placeholder="Distribuidora El Manantial"
                value={form.nombre}
                onChange={handleChange}
                disabled={saving}
              />
              {errores.nombre && <span className="form-error">{errores.nombre}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="telefono-proveedor">Telefono</label>
              <input
                id="telefono-proveedor"
                name="telefono"
                className={`form-input ${errores.telefono ? 'input-error' : ''}`}
                placeholder="+502 5555 1234"
                value={form.telefono}
                onChange={handleChange}
                disabled={saving}
              />
              {errores.telefono && <span className="form-error">{errores.telefono}</span>}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setForm(FORM_INICIAL)
                  setErrores(FORM_INICIAL)
                }}
                disabled={saving}
              >
                Limpiar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : '+ Guardar proveedor'}
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
              placeholder="Buscar por nombre o telefono..."
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
                <button className="btn btn-ghost" onClick={cargarProveedores}>Reintentar</button>
              </div>
            </div>
          )}

          {!error && (
            <div className="table-container">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Cargando proveedores...</p>
                </div>
              ) : proveedoresFiltrados.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{busqueda ? '⌕' : '◈'}</div>
                  <h3>{busqueda ? 'Sin resultados' : 'Sin proveedores aun'}</h3>
                  <p>{busqueda ? 'Ajusta la busqueda para encontrar un proveedor.' : 'Crea tu primer proveedor para registrar compras.'}</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Proveedor</th>
                      <th>Telefono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proveedoresFiltrados.map((proveedor, index) => (
                      <tr key={proveedor.id} className="table-row">
                        <td className="td-number">{index + 1}</td>
                        <td className="td-name">{proveedor.nombre}</td>
                        <td>{proveedor.telefono}</td>
                        <td className="td-actions">
                          <button
                            className="btn btn-danger"
                            onClick={() => setProveedorAEliminar(proveedor)}
                          >
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

export default ProveedoresPage
