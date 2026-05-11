import { useCallback, useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { createFactura, deleteFactura, getFacturas } from '../services/facturaService'
import { getVentas } from '../services/ventaService'

const hoy = new Date().toISOString().slice(0, 10)
const FORM_INICIAL = { numero: '', fecha: hoy, ventaId: '' }

function formatearFecha(valor) {
  if (!valor) return 'Sin fecha'
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? valor : fecha.toLocaleDateString()
}

function FacturasPage() {
  const [facturas, setFacturas] = useState([])
  const [ventas, setVentas] = useState([])
  const [form, setForm] = useState(FORM_INICIAL)
  const [errores, setErrores] = useState(FORM_INICIAL)
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [facturaAEliminar, setFacturaAEliminar] = useState(null)

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [facturasData, ventasData] = await Promise.all([
        getFacturas(),
        getVentas(),
      ])
      setFacturas(facturasData)
      setVentas(ventasData)
    } catch (err) {
      setError('No se pudieron cargar las facturas o las ventas.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const ventaMap = useMemo(
    () => Object.fromEntries(ventas.map((venta) => [venta.id, venta])),
    [ventas]
  )

  const validar = () => {
    const nuevosErrores = { numero: '', fecha: '', ventaId: '' }
    let valido = true

    if (!form.numero.trim()) {
      nuevosErrores.numero = 'El numero es obligatorio.'
      valido = false
    }

    if (!form.fecha) {
      nuevosErrores.fecha = 'La fecha es obligatoria.'
      valido = false
    }

    if (!form.ventaId) {
      nuevosErrores.ventaId = 'Selecciona una venta.'
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
      const nuevaFactura = await createFactura({
        numero: form.numero.trim(),
        fecha: form.fecha,
        ventaId: Number(form.ventaId),
      })
      setFacturas((prev) => [nuevaFactura, ...prev])
      setForm(FORM_INICIAL)
      setErrores(FORM_INICIAL)
      setToast({ message: 'Factura registrada correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'No se pudo guardar la factura.', type: 'error' })
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!facturaAEliminar) return

    try {
      await deleteFactura(facturaAEliminar.id)
      setFacturas((prev) => prev.filter((item) => item.id !== facturaAEliminar.id))
      setToast({ message: 'Factura eliminada correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo eliminar la factura.', type: 'error' })
      console.error(err)
    } finally {
      setFacturaAEliminar(null)
    }
  }

  const facturasFiltradas = facturas.filter((factura) =>
    factura.numero?.toLowerCase().includes(busqueda.toLowerCase()) ||
    String(factura.ventaId ?? '').includes(busqueda) ||
    formatearFecha(factura.fecha).includes(busqueda)
  )

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {facturaAEliminar && (
        <ConfirmDialog
          message={`¿Eliminar la factura "${facturaAEliminar.numero}"?`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setFacturaAEliminar(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Facturas</h1>
          <p className="page-subtitle">Asocia una factura a cada venta facturada.</p>
        </div>
      </div>

      <div className="management-grid">
        <section className="form-card">
          <div className="panel-heading">
            <h2 className="panel-title">Nueva factura</h2>
            <p className="panel-copy">Guarda el numero fiscal y la venta asociada.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="factura-numero">Numero</label>
              <input
                id="factura-numero"
                name="numero"
                className={`form-input ${errores.numero ? 'input-error' : ''}`}
                placeholder="FAC-2026-001"
                value={form.numero}
                onChange={handleChange}
                disabled={saving}
              />
              {errores.numero && <span className="form-error">{errores.numero}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="factura-fecha">Fecha</label>
              <input
                id="factura-fecha"
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
              <label className="form-label" htmlFor="factura-venta">Venta</label>
              <select
                id="factura-venta"
                name="ventaId"
                className={`form-input ${errores.ventaId ? 'input-error' : ''}`}
                value={form.ventaId}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="">Selecciona una venta</option>
                {ventas.map((venta) => (
                  <option key={venta.id} value={venta.id}>
                    {`Venta #${venta.id} - Q${Number(venta.total ?? 0).toFixed(2)}`}
                  </option>
                ))}
              </select>
              {errores.ventaId && <span className="form-error">{errores.ventaId}</span>}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : '+ Guardar factura'}
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
              placeholder="Buscar por numero, fecha o venta..."
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
                  <p>Cargando facturas...</p>
                </div>
              ) : facturasFiltradas.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{busqueda ? '⌕' : '◈'}</div>
                  <h3>{busqueda ? 'Sin resultados' : 'Sin facturas registradas'}</h3>
                  <p>{busqueda ? 'Prueba con otro termino.' : 'Registra la primera factura emitida desde la tienda.'}</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Numero</th>
                      <th>Fecha</th>
                      <th>Venta</th>
                      <th>Total venta</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturasFiltradas.map((factura, index) => (
                      <tr key={factura.id} className="table-row">
                        <td className="td-number">{index + 1}</td>
                        <td className="td-name">{factura.numero}</td>
                        <td>{formatearFecha(factura.fecha)}</td>
                        <td>{`#${factura.ventaId}`}</td>
                        <td>{`Q${Number(ventaMap[factura.ventaId]?.total ?? 0).toFixed(2)}`}</td>
                        <td className="td-actions">
                          <button className="btn btn-danger" onClick={() => setFacturaAEliminar(factura)}>
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

export default FacturasPage
