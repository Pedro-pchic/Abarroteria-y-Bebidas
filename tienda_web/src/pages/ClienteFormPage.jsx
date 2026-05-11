import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getClientes, createCliente, updateCliente } from '../services/clienteService'
import Toast from '../components/Toast'

const FORM_INICIAL = { nombre: '', direccion: '', telefono: '' }
const ERRORES_INICIAL = { nombre: '', direccion: '', telefono: '' }

function ClienteFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = Boolean(id)

  const [form, setForm] = useState(FORM_INICIAL)
  const [errores, setErrores] = useState(ERRORES_INICIAL)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(esEdicion)
  const [toast, setToast] = useState(null)
  const [errorGeneral, setErrorGeneral] = useState(null)

  // Cargar datos del cliente si es edición
  useEffect(() => {
    if (!esEdicion) return

    const cargarCliente = async () => {
      try {
        setLoadingData(true)
        const clientes = await getClientes()
        const cliente = clientes.find(c => String(c.id) === String(id))

        if (!cliente) {
          setErrorGeneral('Cliente no encontrado.')
          return
        }

        setForm({
          nombre: cliente.nombre || '',
          direccion: cliente.direccion || '',
          telefono: cliente.telefono || '',
        })
      } catch (err) {
        setErrorGeneral('No se pudo cargar la información del cliente.')
        console.error(err)
      } finally {
        setLoadingData(false)
      }
    }

    cargarCliente()
  }, [id, esEdicion])

  const validar = () => {
    const nuevosErrores = { nombre: '', direccion: '', telefono: '' }
    let valido = true

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.'
      valido = false
    } else if (form.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres.'
      valido = false
    }

    if (!form.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria.'
      valido = false
    }

    if (!form.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio.'
      valido = false
    } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(form.telefono.trim())) {
      nuevosErrores.telefono = 'Ingresa un teléfono válido (7-15 dígitos).'
      valido = false
    }

    setErrores(nuevosErrores)
    return valido
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    setLoading(true)
    setErrorGeneral(null)

    try {
      const payload = {
        nombre: form.nombre.trim(),
        direccion: form.direccion.trim(),
        telefono: form.telefono.trim(),
      }

      if (esEdicion) {
        await updateCliente(id, payload)
        setToast({ message: 'Cliente actualizado correctamente ✓', type: 'success' })
      } else {
        await createCliente(payload)
        setToast({ message: 'Cliente creado correctamente ✓', type: 'success' })
      }

      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Ocurrió un error. Verifica que el backend esté disponible.'
      setErrorGeneral(mensaje)
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
          <p>Cargando datos del cliente...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate('/')}>
            ← Volver
          </button>
          <h1 className="page-title">
            {esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
          <p className="page-subtitle">
            {esEdicion ? 'Modifica los datos del cliente' : 'Completa el formulario para registrar un cliente'}
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
            <label className="form-label" htmlFor="nombre">
              Nombre completo
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className={`form-input ${errores.nombre ? 'input-error' : ''}`}
              placeholder="Ej: María García López"
              value={form.nombre}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />
            {errores.nombre && (
              <span className="form-error">⚠ {errores.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="direccion">
              Dirección
            </label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              className={`form-input ${errores.direccion ? 'input-error' : ''}`}
              placeholder="Ej: Av. Reforma 123, Zona 10"
              value={form.direccion}
              onChange={handleChange}
              disabled={loading}
            />
            {errores.direccion && (
              <span className="form-error">⚠ {errores.direccion}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="telefono">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              className={`form-input ${errores.telefono ? 'input-error' : ''}`}
              placeholder="Ej: +502 5555 1234"
              value={form.telefono}
              onChange={handleChange}
              disabled={loading}
            />
            {errores.telefono && (
              <span className="form-error">⚠ {errores.telefono}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  {esEdicion ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                esEdicion ? '✓ Guardar cambios' : '+ Crear cliente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClienteFormPage
