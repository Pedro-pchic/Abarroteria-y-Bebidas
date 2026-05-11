import { useCallback, useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { createCompra, deleteCompra, getCompras } from '../services/compraService'
import { getProveedores } from '../services/proveedorService'

const hoy = new Date().toISOString().slice(0, 10)
const FORM_INICIAL = { fecha: hoy, total: '', proveedorId: '' }

function formatearFecha(valor) {
  if (!valor) return 'Sin fecha'
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? valor : fecha.toLocaleDateString()
}

function ComprasPage() {
  const [compras, setCompras] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [form, setForm] = useState(FORM_INICIAL)
  const [errores, setErrores] = useState(FORM_INICIAL)
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [compraAEliminar, setCompraAEliminar] = useState(null)

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [comprasData, proveedoresData] = await Promise.all([
        getCompras(),
        getProveedores(),
      ])
      setCompras(comprasData)
      setProveedores(proveedoresData)
    } catch (err) {
      setError('No se pudieron cargar las compras o los proveedores.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const proveedorMap = useMemo(
    () => Object.fromEntries(proveedores.map((proveedor) => [proveedor.id, proveedor.nombre])),
    [proveedores]
  )

  const validar = () => {
    const nuevosErrores = { fecha: '', total: '', proveedorId: '' }
    let valido = true

    if (!form.fecha) {
      nuevosErrores.fecha = 'La fecha es obligatoria.'
      valido = false
    }

    if (!form.total || Number(form.total) <= 0) {
      nuevosErrores.total = 'Ingresa un total valido.'
      valido = false
    }

    if (!form.proveedorId) {
      nuevosErrores.proveedorId = 'Selecciona un proveedor.'
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
      const nuevaCompra = await createCompra({
        fecha: form.fecha,
        total: Number(form.total),
        proveedorId: Number(form.proveedorId),
      })

      setCompras((prev) => [nuevaCompra, ...prev])
      setForm(FORM_INICIAL)
      setErrores(FORM_INICIAL)
      setToast({ message: 'Compra registrada correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo guardar la compra.', type: 'error' })
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!compraAEliminar) return

    try {
      await deleteCompra(compraAEliminar.id)
      setCompras((prev) => prev.filter((item) => item.id !== compraAEliminar.id))
      setToast({ message: 'Compra eliminada correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo eliminar la compra.', type: 'error' })
      console.error(err)
    } finally {
      setCompraAEliminar(null)
    }
  }

  const comprasFiltradas = compras.filter((compra) => {
    const nombreProveedor = proveedorMap[compra.proveedorId] || ''
    return (
      nombreProveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(compra.total ?? '').includes(busqueda) ||
      formatearFecha(compra.fecha).includes(busqueda)
    )
  })

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {compraAEliminar && (
        <ConfirmDialog
          message={`¿Eliminar la compra #${compraAEliminar.id}?`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setCompraAEliminar(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Compras</h1>
          <p className="page-subtitle">Registra entradas de mercaderia y su proveedor asociado.</p>
        </div>
      </div>

      <div className="management-grid">
        <section className="form-card">
          <div className="panel-heading">
            <h2 className="panel-title">Nueva compra</h2>
            <p className="panel-copy">Guarda el monto y el proveedor de cada abastecimiento.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="fecha-compra">Fecha</label>
              <input
                id="fecha-compra"
                type="date"
                name="fecha"
                className={`form-input ${errores.fecha ? 'input-error' : ''}`}
                value={form.fecha}
                onChange={handleChange}
                disabled={saving}
              />
              {errores.fecha && <span className="form-error">{errores.fecha}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="total-compra">Total</label>
              <input
                id="total-compra"
                type="number"
                min="0"
                step="0.01"
                name="total"
                className={`form-input ${errores.total ? 'input-error' : ''}`}
                placeholder="1250.00"
                value={form.total}
                onChange={handleChange}
                disabled={saving}
              />
              {errores.total && <span className="form-error">{errores.total}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proveedor-compra">Proveedor</label>
              <select
                id="proveedor-compra"
                name="proveedorId"
                className={`form-input ${errores.proveedorId ? 'input-error' : ''}`}
                value={form.proveedorId}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="">Selecciona un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
              {errores.proveedorId && <span className="form-error">{errores.proveedorId}</span>}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : '+ Guardar compra'}
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
              placeholder="Buscar por proveedor, fecha o total..."
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
                <button className="btn btn-ghost" onClick={cargarDatos}>Reintentar</button>
              </div>
            </div>
          )}

          {!error && (
            <div className="table-container">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Cargando compras...</p>
                </div>
              ) : comprasFiltradas.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{busqueda ? '⌕' : '◈'}</div>
                  <h3>{busqueda ? 'Sin resultados' : 'Sin compras registradas'}</h3>
                  <p>{busqueda ? 'No se encontraron compras con ese criterio.' : 'Agrega una compra para llevar control del abastecimiento.'}</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fecha</th>
                      <th>Proveedor</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comprasFiltradas.map((compra, index) => (
                      <tr key={compra.id} className="table-row">
                        <td className="td-number">{index + 1}</td>
                        <td>{formatearFecha(compra.fecha)}</td>
                        <td className="td-name">{proveedorMap[compra.proveedorId] || `#${compra.proveedorId}`}</td>
                        <td>Q{Number(compra.total ?? 0).toFixed(2)}</td>
                        <td className="td-actions">
                          <button className="btn btn-danger" onClick={() => setCompraAEliminar(compra)}>
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

export default ComprasPage
