import { useNavigate } from 'react-router-dom'

function ClienteRow({ cliente, onDelete, index }) {
  const navigate = useNavigate()

  return (
    <tr className="table-row" style={{ animationDelay: `${index * 40}ms` }}>
      <td className="td-number">{index + 1}</td>

      <td className="td-name">
        <div className="avatar-name">
          <span className="avatar">
            {cliente.nombre?.charAt(0).toUpperCase() || '?'}
          </span>
          <span className="nombre-texto">{cliente.nombre}</span>
        </div>
      </td>

      <td className="td-text">{cliente.direccion}</td>
      <td className="td-text">{cliente.telefono}</td>

      <td className="td-actions">
        <div className="actions">
          <button
            className="btn btn-sm btn-edit"
            onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
            title="Editar"
          >
            ✎
          </button>

          <button
            className="btn btn-sm btn-delete"
            onClick={() => onDelete(cliente)}
            title="Eliminar"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ClienteRow
