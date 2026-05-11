import api from './api'


export const getVentas = async () => (await api.get('/ventas')).data
export const getVentaById = async (id) => (await api.get(`/ventas/${id}`)).data
export const createVenta = async (data) => (await api.post('/ventas', data)).data
export const deleteVenta = async (id) => (await api.delete(`/ventas/${id}`)).data
