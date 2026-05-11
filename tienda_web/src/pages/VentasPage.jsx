import { useCallback, useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { getClientes } from '../services/clienteService'
import { getProductos } from '../services/productoService'
import { createVenta, deleteVenta, getVentas } from '../services/ventaService'

const DETALLE_INICIAL = { productoId: '', cantidad: '1', precio: '' }

function formatearFecha(valor) {
  if (!valor) return 'Sin fecha'
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? valor : fecha.toLocaleDateString()
}

function VentasPage() {
  const [ventas, setVentas] = useState([])
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [detalles, setDetalles] = useState([DETALLE_INICIAL])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [ventaAEliminar, setVentaAEliminar] = useState(null)

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [ventasData, clientesData, productosData] = await Promise.all([
        getVentas(),
        getClientes(),
        getProductos(),
      ])

      setVentas(ventasData)
      setClientes(clientesData)
      setProductos(productosData)
    } catch (err) {
      setError('No se pudieron cargar las ventas, clientes o productos.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const clienteMap = useMemo(
    () => Object.fromEntries(clientes.map((cliente) => [cliente.id, cliente.nombre])),
    [clientes]
  )

  const productoMap = useMemo(
    () => Object.fromEntries(productos.map((producto) => [producto.id, producto])),
    [productos]
  )

  const totalCalculado = detalles.reduce((acumulado, detalle) => {
    const cantidad = Number(detalle.cantidad || 0)
    const precio = Number(detalle.precio || 0)
    return acumulado + cantidad * precio
  }, 0)

  const actualizarDetalle = (index, campo, valor) => {
    setDetalles((prev) =>
      prev.map((detalle, idx) => {
        if (idx !== index) return detalle

        if (campo === 'productoId') {
          const producto = productoMap[Number(valor)]
          return {
            ...detalle,
            productoId: valor,
            precio: producto?.precio != null ? String(producto.precio) : '',
          }
        }

        return { ...detalle, [campo]: valor }
      })
    )
  }

  const agregarDetalle = () => {
    setDetalles((prev) => [...prev, DETALLE_INICIAL])
  }

  const eliminarDetalle = (index) => {
    setDetalles((prev) => prev.filter((_, idx) => idx !== index))
  }

  const validar = () => {
    if (detalles.length === 0) {
      setToast({ message: 'Agrega al menos un producto a la venta.', type: 'error' })
      return false
    }

    const invalido = detalles.some((detalle) =>
      !detalle.productoId ||
      Number(detalle.cantidad) <= 0 ||
      Number(detalle.precio) <= 0
    )

    if (invalido) {
      setToast({ message: 'Completa cada detalle con producto, cantidad y precio validos.', type: 'error' })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    try {
      setSaving(true)
      const nuevaVenta = await createVenta({
        clienteId: clienteId ? Number(clienteId) : null,
        detalles: detalles.map((detalle) => ({
          productoId: Number(detalle.productoId),
          cantidad: Number(detalle.cantidad),
          precio: Number(detalle.precio),
        })),
      })

      setVentas((prev) => [nuevaVenta, ...prev])
      setClienteId('')
      setDetalles([DETALLE_INICIAL])
      setToast({ message: 'Venta registrada correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo registrar la venta.', type: 'error' })
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!ventaAEliminar) return

    try {
      await deleteVenta(ventaAEliminar.id)
      setVentas((prev) => prev.filter((item) => item.id !== ventaAEliminar.id))
      setToast({ message: 'Venta eliminada correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo eliminar la venta.', type: 'error' })
      console.error(err)
    } finally {
      setVentaAEliminar(null)
    }
  }

  const ventasFiltradas = ventas.filter((venta) => {
    const cliente = clienteMap[venta.clienteId] || 'Consumidor final'
    return (
      cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(venta.total ?? '').includes(busqueda) ||
      formatearFecha(venta.fecha).includes(busqueda)
    )
  })

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {ventaAEliminar && (
        <ConfirmDialog
          message={`¿Eliminar la venta #${ventaAEliminar.id}?`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setVentaAEliminar(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Ventas</h1>
          <p className="page-subtitle">Registra tickets de mostrador con sus productos vendidos.</p>
        </div>
      </div>

      <div className="management-grid sales-grid">
        <section className="form-card">
          <div className="panel-heading">
            <h2 className="panel-title">Nueva venta</h2>
            <p className="panel-copy">Selecciona cliente, productos, cantidades y precio final.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="cliente-venta">Cliente</label>
              <select
                id="cliente-venta"
                className="form-input"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                disabled={saving}
              >
                <option value="">Consumidor final</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="detail-list">
              {detalles.map((detalle, index) => (
                <div key={`${index}-${detalle.productoId}`} className="detail-row">
                  <select
                    className="form-input"
                    value={detalle.productoId}
                    onChange={(e) => actualizarDetalle(index, 'productoId', e.target.value)}
                    disabled={saving}
                  >
                    <option value="">Producto</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="Cantidad"
                    value={detalle.cantidad}
                    onChange={(e) => actualizarDetalle(index, 'cantidad', e.target.value)}
                    disabled={saving}
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder="Precio"
                    value={detalle.precio}
                    onChange={(e) => actualizarDetalle(index, 'precio', e.target.value)}
                    disabled={saving}
                  />

                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => eliminarDetalle(index)}
                    disabled={saving || detalles.length === 1}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>

            <div className="sales-toolbar">
              <button type="button" className="btn btn-secondary" onClick={agregarDetalle} disabled={saving}>
                + Agregar producto
              </button>
              <div className="sales-total">Total estimado: <strong>Q{totalCalculado.toFixed(2)}</strong></div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : '+ Guardar venta'}
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
              placeholder="Buscar por cliente, fecha o total..."
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
                  <p>Cargando ventas...</p>
                </div>
              ) : ventasFiltradas.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{busqueda ? '⌕' : '◈'}</div>
                  <h3>{busqueda ? 'Sin resultados' : 'Sin ventas registradas'}</h3>
                  <p>{busqueda ? 'Prueba con otro cliente o fecha.' : 'Registra una venta para ver movimientos del mostrador.'}</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasFiltradas.map((venta, index) => (
                      <tr key={venta.id} className="table-row">
                        <td className="td-number">{index + 1}</td>
                        <td>{formatearFecha(venta.fecha)}</td>
                        <td className="td-name">{clienteMap[venta.clienteId] || 'Consumidor final'}</td>
                        <td>{venta.detalles?.length || 0}</td>
                        <td>Q{Number(venta.total ?? 0).toFixed(2)}</td>
                        <td className="td-actions">
                          <button className="btn btn-danger" onClick={() => setVentaAEliminar(venta)}>
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

export default VentasPage
