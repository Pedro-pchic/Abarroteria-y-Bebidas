import api from './api'


export const getClientes = async () => (await api.get('/clientes')).data
export const getClienteById = async (id) => (await api.get(`/clientes/${id}`)).data
export const createCliente = async (data) => (await api.post('/clientes', data)).data
export const updateCliente = async (id, data) => (await api.put(`/clientes/${id}`, data)).data
export const deleteCliente = async (id) => (await api.delete(`/clientes/${id}`)).data
