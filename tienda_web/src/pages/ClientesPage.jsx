import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientes, deleteCliente } from '../services/clienteService'
import ClienteRow from '../components/ClienteRow'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'

function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [clienteAEliminar, setClienteAEliminar] = useState(null)
  const [toast, setToast] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getClientes()
      setClientes(data)
    } catch (err) {
      setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

  const handleEliminar = async () => {
    if (!clienteAEliminar) return
    try {
      await deleteCliente(clienteAEliminar.id)
      setClientes(prev => prev.filter(c => c.id !== clienteAEliminar.id))
      setToast({ message: `Cliente "${clienteAEliminar.nombre}" eliminado correctamente`, type: 'success' })
    } catch (err) {
      setToast({ message: 'Error al eliminar el cliente. Intenta de nuevo.', type: 'error' })
      console.error(err)
    } finally {
      setClienteAEliminar(null)
    }
  }

  const clientesFiltrados = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.direccion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.telefono?.includes(busqueda)
  )

  return (
    <div className="page clientes-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {clienteAEliminar && (
        <ConfirmDialog
          message={`¿Estás seguro de eliminar a "${clienteAEliminar.nombre}"?`}
          onConfirm={handleEliminar}
          onCancel={() => setClienteAEliminar(null)}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">
            {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} registrado{clientes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/clientes/nuevo')}>
          + Nuevo Cliente
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠</span>
          <div>
            <strong>Error de conexión</strong>
            <p>{error}</p>
            <button className="btn btn-sm btn-ghost" onClick={cargarClientes}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!error && (
        <>
          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, dirección o teléfono..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="search-clear" onClick={() => setBusqueda('')}>×</button>
            )}
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando clientes...</p>
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{busqueda ? '⌕' : '◈'}</div>
              <h3>{busqueda ? 'Sin resultados' : 'Sin clientes aún'}</h3>
              <p>
                {busqueda
                  ? `No se encontraron clientes para "${busqueda}"`
                  : 'Agrega tu primer cliente para comenzar'}
              </p>
              {!busqueda && (
                <button className="btn btn-primary" onClick={() => navigate('/clientes/nuevo')}>
                  + Agregar Cliente
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente, index) => (
                    <ClienteRow
                      key={cliente.id}
                      cliente={cliente}
                      index={index}
                      onDelete={setClienteAEliminar}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ClientesPage
