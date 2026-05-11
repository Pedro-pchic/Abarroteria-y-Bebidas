import { useCallback, useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { createPago, deletePago, getPagos } from '../services/pagoService'
import { getVentas } from '../services/ventaService'

const FORM_INICIAL = { monto: '', metodo: '', ventaId: '' }

function PagosPage() {
  const [pagos, setPagos] = useState([])
  const [ventas, setVentas] = useState([])
  const [form, setForm] = useState(FORM_INICIAL)
  const [errores, setErrores] = useState(FORM_INICIAL)
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [pagoAEliminar, setPagoAEliminar] = useState(null)

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [pagosData, ventasData] = await Promise.all([
        getPagos(),
        getVentas(),
      ])
      setPagos(pagosData)
      setVentas(ventasData)
    } catch (err) {
      setError('No se pudieron cargar los pagos o las ventas.')
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
    const nuevosErrores = { monto: '', metodo: '', ventaId: '' }
    let valido = true

    if (!form.monto || Number(form.monto) <= 0) {
      nuevosErrores.monto = 'Ingresa un monto valido.'
      valido = false
    }

    if (!form.metodo.trim()) {
      nuevosErrores.metodo = 'El metodo es obligatorio.'
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
      const nuevoPago = await createPago({
        monto: Number(form.monto),
        metodo: form.metodo.trim(),
        ventaId: Number(form.ventaId),
      })
      setPagos((prev) => [nuevoPago, ...prev])
      setForm(FORM_INICIAL)
      setErrores(FORM_INICIAL)
      setToast({ message: 'Pago registrado correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo guardar el pago.', type: 'error' })
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!pagoAEliminar) return

    try {
      await deletePago(pagoAEliminar.id)
      setPagos((prev) => prev.filter((item) => item.id !== pagoAEliminar.id))
      setToast({ message: 'Pago eliminado correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo eliminar el pago.', type: 'error' })
      console.error(err)
    } finally {
      setPagoAEliminar(null)
    }
  }

  const pagosFiltrados = pagos.filter((pago) =>
    pago.metodo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    String(pago.ventaId ?? '').includes(busqueda) ||
    String(pago.monto ?? '').includes(busqueda)
  )

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {pagoAEliminar && (
        <ConfirmDialog
          message={`¿Eliminar el pago de Q${Number(pagoAEliminar.monto ?? 0).toFixed(2)}?`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setPagoAEliminar(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Pagos</h1>
          <p className="page-subtitle">Controla los pagos recibidos y su venta relacionada.</p>
        </div>
      </div>

      <div className="management-grid">
        <section className="form-card">
          <div className="panel-heading">
            <h2 className="panel-title">Nuevo pago</h2>
            <p className="panel-copy">Registra monto, metodo y venta cancelada.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="pago-monto">Monto</label>
              <input
                id="pago-monto"
                type="number"
                min="0"
                step="0.01"
                name="monto"
                className={`form-input ${errores.monto ? 'input-error' : ''}`}
                placeholder="150.00"
                value={form.monto}
                onChange={handleChange}
                disabled={saving}
              />
              {errores.monto && <span className="form-error">{errores.monto}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pago-metodo">Metodo</label>
              <input
                id="pago-metodo"
                name="metodo"
                className={`form-input ${errores.metodo ? 'input-error' : ''}`}
                placeholder="Efectivo, transferencia, tarjeta"
                value={form.metodo}
                onChange={handleChange}
                disabled={saving}
              />
              {errores.metodo && <span className="form-error">{errores.metodo}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pago-venta">Venta</label>
              <select
                id="pago-venta"
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
                {saving ? 'Guardando...' : '+ Guardar pago'}
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
              placeholder="Buscar por metodo, monto o venta..."
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
                  <p>Cargando pagos...</p>
                </div>
              ) : pagosFiltrados.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{busqueda ? '⌕' : '◈'}</div>
                  <h3>{busqueda ? 'Sin resultados' : 'Sin pagos registrados'}</h3>
                  <p>{busqueda ? 'Prueba con otro metodo o venta.' : 'Registra el primer pago recibido en caja.'}</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Monto</th>
                      <th>Metodo</th>
                      <th>Venta</th>
                      <th>Total venta</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagosFiltrados.map((pago, index) => (
                      <tr key={pago.id} className="table-row">
                        <td className="td-number">{index + 1}</td>
                        <td className="td-name">{`Q${Number(pago.monto ?? 0).toFixed(2)}`}</td>
                        <td>{pago.metodo}</td>
                        <td>{`#${pago.ventaId}`}</td>
                        <td>{`Q${Number(ventaMap[pago.ventaId]?.total ?? 0).toFixed(2)}`}</td>
                        <td className="td-actions">
                          <button className="btn btn-danger" onClick={() => setPagoAEliminar(pago)}>
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

export default PagosPage
