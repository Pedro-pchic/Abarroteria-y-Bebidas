import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { deleteProducto, getProductos } from '../services/productoService'
import { getProveedores } from '../services/proveedorService'

function ProductosPage() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [productoAEliminar, setProductoAEliminar] = useState(null)

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [productosData, proveedoresData] = await Promise.all([
        getProductos(),
        getProveedores(),
      ])
      setProductos(productosData)
      setProveedores(proveedoresData)
    } catch (err) {
      setError('No se pudieron cargar los productos o los proveedores.')
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

  const inventarioResumen = useMemo(() => {
    const agotados = productos.filter((producto) => Number(producto.stock || 0) <= 0)
    const stockBajo = productos.filter((producto) => Number(producto.stock || 0) > 0 && Number(producto.stock || 0) <= 5)
    const stockSaludable = productos.filter((producto) => Number(producto.stock || 0) > 5)

    return {
      total: productos.length,
      agotados: agotados.length,
      stockBajo: stockBajo.length,
      stockSaludable: stockSaludable.length,
    }
  }, [productos])

  const productosFiltrados = productos.filter((producto) => {
    const proveedor = proveedorMap[producto.proveedorId] || ''
    return (
      producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(producto.stock ?? '').includes(busqueda)
    )
  })

  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return

    try {
      await deleteProducto(productoAEliminar.id)
      setProductos((prev) => prev.filter((item) => item.id !== productoAEliminar.id))
      setToast({ message: 'Producto eliminado correctamente.', type: 'success' })
    } catch (err) {
      setToast({ message: 'No se pudo eliminar el producto.', type: 'error' })
      console.error(err)
    } finally {
      setProductoAEliminar(null)
    }
  }

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {productoAEliminar && (
        <ConfirmDialog
          message={`¿Eliminar el producto "${productoAEliminar.nombre}"?`}
          onConfirm={confirmarEliminacion}
          onCancel={() => setProductoAEliminar(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">
            Controla precio, stock y proveedor de cada articulo de la tienda.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/productos/nuevo')}>
          + Nuevo producto
        </button>
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
              <span className="stat-label">Productos en inventario</span>
              <strong className="stat-value">{inventarioResumen.total}</strong>
              <span className="stat-note">Catalogo actual</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">Stock actual estable</span>
              <strong className="stat-value">{inventarioResumen.stockSaludable}</strong>
              <span className="stat-note">Mas de 5 unidades</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">Stock bajo</span>
              <strong className="stat-value">{inventarioResumen.stockBajo}</strong>
              <span className="stat-note">Entre 1 y 5 unidades</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">Agotados</span>
              <strong className="stat-value">{inventarioResumen.agotados}</strong>
              <span className="stat-note">Requieren reposicion</span>
            </article>
          </section>

          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, proveedor o stock..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="search-clear" onClick={() => setBusqueda('')}>×</button>
            )}
          </div>

          <div className="table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando productos...</p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{busqueda ? '⌕' : '◈'}</div>
                <h3>{busqueda ? 'Sin resultados' : 'Sin productos registrados'}</h3>
                <p>
                  {busqueda
                    ? 'No encontramos productos con ese criterio.'
                    : 'Agrega el primer producto para comenzar a vender.'}
                </p>
                {!busqueda && (
                  <button className="btn btn-primary" onClick={() => navigate('/productos/nuevo')}>
                    + Crear producto
                  </button>
                )}
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Proveedor</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto, index) => (
                    <tr key={producto.id} className="table-row">
                      <td className="td-number">{index + 1}</td>
                      <td className="td-name">{producto.nombre}</td>
                      <td>{proveedorMap[producto.proveedorId] || 'Sin proveedor'}</td>
                      <td>{`Q${Number(producto.precio ?? 0).toFixed(2)}`}</td>
                      <td>
                        <span className={`stock-badge ${
                          Number(producto.stock || 0) <= 0
                            ? 'stock-out'
                            : Number(producto.stock || 0) <= 5
                              ? 'stock-low'
                              : 'stock-good'
                        }`}
                        >
                          {Number(producto.stock || 0) <= 0
                            ? 'Agotado'
                            : Number(producto.stock || 0) <= 5
                              ? `Bajo: ${producto.stock}`
                              : `OK: ${producto.stock}`}
                        </span>
                      </td>
                      <td className="td-actions">
                        <button
                          className="btn btn-edit"
                          onClick={() => navigate(`/productos/editar/${producto.id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => setProductoAEliminar(producto)}
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
        </>
      )}
    </div>
  )
}

export default ProductosPage
