import api from './api'

export const getCompras = async () => (await api.get('/compras')).data
export const getCompraById = async (id) => (await api.get(`/compras/${id}`)).data
export const createCompra = async (data) => (await api.post('/compras', data)).data
export const deleteCompra = async (id) => (await api.delete(`/compras/${id}`)).data
