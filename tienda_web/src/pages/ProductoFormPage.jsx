import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Toast from '../components/Toast'
import { createProducto, getProductoById, updateProducto } from '../services/productoService'
import { getProveedores } from '../services/proveedorService'

const FORM_INICIAL = { nombre: '', precio: '', stock: '', proveedorId: '' }
const ERRORES_INICIAL = { nombre: '', precio: '', stock: '', proveedorId: '' }

function ProductoFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const esEdicion = Boolean(id)

  const [form, setForm] = useState(FORM_INICIAL)
  const [errores, setErrores] = useState(ERRORES_INICIAL)
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true)
        setErrorGeneral(null)

        const proveedoresData = await getProveedores()
        setProveedores(proveedoresData)

        if (esEdicion) {
          const producto = await getProductoById(id)
          setForm({
            nombre: producto.nombre || '',
            precio: producto.precio != null ? String(producto.precio) : '',
            stock: producto.stock != null ? String(producto.stock) : '',
            proveedorId: producto.proveedorId != null ? String(producto.proveedorId) : '',
          })
        }
      } catch (err) {
        setErrorGeneral('No se pudieron cargar los datos del producto.')
        console.error(err)
      } finally {
        setLoadingData(false)
      }
    }

    cargarDatos()
  }, [esEdicion, id])

  const validar = () => {
    const nuevosErrores = { nombre: '', precio: '', stock: '', proveedorId: '' }
    let valido = true

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.'
      valido = false
    }

    if (!form.precio || Number(form.precio) <= 0) {
      nuevosErrores.precio = 'Ingresa un precio valido.'
      valido = false
    }

    if (form.stock === '' || Number(form.stock) < 0) {
      nuevosErrores.stock = 'Ingresa un stock valido.'
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
      setLoading(true)
      setErrorGeneral(null)

      const payload = {
        nombre: form.nombre.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock),
        proveedorId: Number(form.proveedorId),
      }

      if (esEdicion) {
        await updateProducto(id, payload)
        setToast({ message: 'Producto actualizado correctamente.', type: 'success' })
      } else {
        await createProducto(payload)
        setToast({ message: 'Producto creado correctamente.', type: 'success' })
      }

      setTimeout(() => navigate('/productos-admin'), 1200)
    } catch (err) {
      setErrorGeneral(err.response?.data?.message || 'No se pudo guardar el producto.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate('/productos-admin')}>
            ← Volver
          </button>
          <h1 className="page-title">{esEdicion ? 'Editar Producto' : 'Nuevo Producto'}</h1>
          <p className="page-subtitle">
            {esEdicion
              ? 'Actualiza el precio, stock o proveedor del producto.'
              : 'Registra un producto nuevo para el inventario de la tienda.'}
          </p>
        </div>
      </div>

      {errorGeneral && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <span className="alert-icon">⚠</span>
          <div>
            <strong>Error</strong>
            <p>{errorGeneral}</p>
          </div>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="producto-nombre">Nombre</label>
            <input
              id="producto-nombre"
              name="nombre"
              className={`form-input ${errores.nombre ? 'input-error' : ''}`}
              placeholder="Coca Cola 2L"
              value={form.nombre}
              onChange={handleChange}
              disabled={loading}
            />
            {errores.nombre && <span className="form-error">{errores.nombre}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="producto-precio">Precio</label>
            <input
              id="producto-precio"
              type="number"
              step="0.01"
              min="0"
              name="precio"
              className={`form-input ${errores.precio ? 'input-error' : ''}`}
              placeholder="18.50"
              value={form.precio}
              onChange={handleChange}
              disabled={loading}
            />
            {errores.precio && <span className="form-error">{errores.precio}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="producto-stock">Stock</label>
            <input
              id="producto-stock"
              type="number"
              min="0"
              name="stock"
              className={`form-input ${errores.stock ? 'input-error' : ''}`}
              placeholder="24"
              value={form.stock}
              onChange={handleChange}
              disabled={loading}
            />
            {errores.stock && <span className="form-error">{errores.stock}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="producto-proveedor">Proveedor</label>
            <select
              id="producto-proveedor"
              name="proveedorId"
              className={`form-input ${errores.proveedorId ? 'input-error' : ''}`}
              value={form.proveedorId}
              onChange={handleChange}
              disabled={loading}
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
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/productos-admin')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductoFormPage
