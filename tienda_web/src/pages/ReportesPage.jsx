import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCompras } from '../services/compraService'
import { getProductos } from '../services/productoService'
import { getProveedores } from '../services/proveedorService'
import { getVentas } from '../services/ventaService'

function formatearMoneda(valor) {
  return `Q${Number(valor || 0).toFixed(2)}`
}

function formatearFecha(valor) {
  if (!valor) return 'Sin fecha'
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? valor : fecha.toLocaleDateString()
}

function mismaFecha(valor, referencia) {
  const fecha = new Date(valor)
  return (
    fecha.getFullYear() === referencia.getFullYear() &&
    fecha.getMonth() === referencia.getMonth() &&
    fecha.getDate() === referencia.getDate()
  )
}

function ReportesPage() {
  const [productos, setProductos] = useState([])
  const [ventas, setVentas] = useState([])
  const [compras, setCompras] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [productosData, ventasData, comprasData, proveedoresData] = await Promise.all([
        getProductos(),
        getVentas(),
        getCompras(),
        getProveedores(),
      ])

      setProductos(productosData)
      setVentas(ventasData)
      setCompras(comprasData)
      setProveedores(proveedoresData)
    } catch (err) {
      setError('No se pudieron cargar los datos para reportes.')
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

  const resumen = useMemo(() => {
    const hoy = new Date()
    const ventasHoy = ventas.filter((venta) => mismaFecha(venta.fecha, hoy))
    const comprasHoy = compras.filter((compra) => mismaFecha(compra.fecha, hoy))
    const totalVentas = ventas.reduce((sum, venta) => sum + Number(venta.total || 0), 0)
    const totalCompras = compras.reduce((sum, compra) => sum + Number(compra.total || 0), 0)
    const stockTotal = productos.reduce((sum, producto) => sum + Number(producto.stock || 0), 0)
    const stockBajo = productos.filter((producto) => Number(producto.stock || 0) > 0 && Number(producto.stock || 0) <= 5)
    const agotados = productos.filter((producto) => Number(producto.stock || 0) <= 0)

    return {
      totalVentas,
      totalCompras,
      margen: totalVentas - totalCompras,
      ventasHoy: ventasHoy.reduce((sum, venta) => sum + Number(venta.total || 0), 0),
      comprasHoy: comprasHoy.reduce((sum, compra) => sum + Number(compra.total || 0), 0),
      stockTotal,
      stockBajo,
      agotados,
    }
  }, [compras, productos, ventas])

  const topProductos = useMemo(() => {
    const acumulado = new Map()

    ventas.forEach((venta) => {
      venta.detalles?.forEach((detalle) => {
        const actual = acumulado.get(detalle.productoId) || { cantidad: 0, ingresos: 0 }
        acumulado.set(detalle.productoId, {
          cantidad: actual.cantidad + Number(detalle.cantidad || 0),
          ingresos: actual.ingresos + Number(detalle.cantidad || 0) * Number(detalle.precio || 0),
        })
      })
    })

    return [...acumulado.entries()]
      .map(([productoId, data]) => {
        const producto = productos.find((item) => item.id === productoId)
        return {
          productoId,
          nombre: producto?.nombre || `Producto #${productoId}`,
          cantidad: data.cantidad,
          ingresos: data.ingresos,
          stock: producto?.stock ?? 0,
        }
      })
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
  }, [productos, ventas])

  const ultimasCompras = useMemo(
    () =>
      [...compras]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5),
    [compras]
  )

  const stockActual = useMemo(
    () =>
      [...productos]
        .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
        .slice(0, 8),
    [productos]
  )

  const inventarioDetallado = useMemo(
    () =>
      [...productos]
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .slice(0, 10),
    [productos]
  )

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Resumen operativo de ventas, compras e inventario.</p>
        </div>
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
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <span className="stat-label">Ventas acumuladas</span>
              <strong className="stat-value">{formatearMoneda(resumen.totalVentas)}</strong>
              <span className="stat-note">{`${ventas.length} ventas registradas`}</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">Compras acumuladas</span>
              <strong className="stat-value">{formatearMoneda(resumen.totalCompras)}</strong>
              <span className="stat-note">{`${compras.length} compras registradas`}</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">Balance estimado</span>
              <strong className="stat-value">{formatearMoneda(resumen.margen)}</strong>
              <span className="stat-note">Ventas menos compras</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">Inventario total</span>
              <strong className="stat-value">{resumen.stockTotal}</strong>
              <span className="stat-note">{`${productos.length} productos activos`}</span>
            </article>
          </section>

          <section className="report-grid">
            <article className="report-card">
              <div className="panel-heading">
                <h2 className="panel-title">Movimiento de hoy</h2>
                <p className="panel-copy">Caja y abastecimiento del dia actual.</p>
              </div>
              <div className="kpi-stack">
                <div className="kpi-row">
                  <span>Ventas hoy</span>
                  <strong>{formatearMoneda(resumen.ventasHoy)}</strong>
                </div>
                <div className="kpi-row">
                  <span>Compras hoy</span>
                  <strong>{formatearMoneda(resumen.comprasHoy)}</strong>
                </div>
                <div className="kpi-row">
                  <span>Stock bajo</span>
                  <strong>{resumen.stockBajo.length}</strong>
                </div>
                <div className="kpi-row">
                  <span>Productos agotados</span>
                  <strong>{resumen.agotados.length}</strong>
                </div>
              </div>
            </article>

            <article className="report-card">
              <div className="panel-heading">
                <h2 className="panel-title">Top productos</h2>
                <p className="panel-copy">Los articulos con mayor salida registrada.</p>
              </div>
              {topProductos.length === 0 ? (
                <p className="report-empty">Todavia no hay ventas para calcular ranking.</p>
              ) : (
                <div className="mini-list">
                  {topProductos.map((item) => (
                    <div key={item.productoId} className="mini-row">
                      <div>
                        <strong>{item.nombre}</strong>
                        <p>{`${item.cantidad} unidades vendidas`}</p>
                      </div>
                      <div className="mini-metric">
                        <span>{formatearMoneda(item.ingresos)}</span>
                        <small>{`Stock: ${item.stock}`}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>

          <section className="report-grid">
            <article className="report-card">
              <div className="panel-heading">
                <h2 className="panel-title">Stock actual</h2>
                <p className="panel-copy">Estado actual de existencias con prioridad a lo mas urgente.</p>
              </div>
              {stockActual.length === 0 ? (
                <p className="report-empty">Todavia no hay productos para revisar stock.</p>
              ) : (
                <div className="mini-list">
                  {stockActual.map((producto) => (
                    <div key={producto.id} className="mini-row">
                      <div>
                        <strong>{producto.nombre}</strong>
                        <p>{proveedorMap[producto.proveedorId] || 'Sin proveedor'}</p>
                      </div>
                      <div className="mini-metric">
                        <span>{`Q${Number(producto.precio ?? 0).toFixed(2)}`}</span>
                        <small>{`Stock: ${producto.stock}`}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="report-card">
              <div className="panel-heading">
                <h2 className="panel-title">Alertas de inventario</h2>
                <p className="panel-copy">Productos que necesitan reposicion pronto.</p>
              </div>
              {resumen.stockBajo.length === 0 && resumen.agotados.length === 0 ? (
                <p className="report-empty">No hay alertas de stock en este momento.</p>
              ) : (
                <div className="mini-list">
                  {[...resumen.agotados, ...resumen.stockBajo].slice(0, 8).map((producto) => (
                    <div key={producto.id} className="mini-row">
                      <div>
                        <strong>{producto.nombre}</strong>
                        <p>{proveedorMap[producto.proveedorId] || 'Sin proveedor'}</p>
                      </div>
                      <span className={`stock-badge ${Number(producto.stock || 0) <= 0 ? 'stock-out' : 'stock-low'}`}>
                        {Number(producto.stock || 0) <= 0 ? 'Agotado' : `Bajo: ${producto.stock}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="report-card">
              <div className="panel-heading">
                <h2 className="panel-title">Productos en inventario</h2>
                <p className="panel-copy">Vista general del inventario con precio, proveedor y unidades.</p>
              </div>
              {inventarioDetallado.length === 0 ? (
                <p className="report-empty">Todavia no hay productos registrados en inventario.</p>
              ) : (
                <div className="inventory-list">
                  {inventarioDetallado.map((producto) => (
                    <div key={producto.id} className="inventory-row">
                      <div className="inventory-main">
                        <strong>{producto.nombre}</strong>
                        <p>{proveedorMap[producto.proveedorId] || 'Sin proveedor'}</p>
                      </div>
                      <div className="inventory-meta">
                        <span>{formatearMoneda(producto.precio)}</span>
                        <small>{`${producto.stock} unidades`}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="report-card">
              <div className="panel-heading">
                <h2 className="panel-title">Ultimas compras</h2>
                <p className="panel-copy">Las entradas de mercaderia mas recientes.</p>
              </div>
              {ultimasCompras.length === 0 ? (
                <p className="report-empty">Todavia no hay compras registradas.</p>
              ) : (
                <div className="mini-list">
                  {ultimasCompras.map((compra) => (
                    <div key={compra.id} className="mini-row">
                      <div>
                        <strong>{proveedorMap[compra.proveedorId] || `Proveedor #${compra.proveedorId}`}</strong>
                        <p>{formatearFecha(compra.fecha)}</p>
                      </div>
                      <div className="mini-metric">
                        <span>{formatearMoneda(compra.total)}</span>
                        <small>{`Compra #${compra.id}`}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  )
}

export default ReportesPage
