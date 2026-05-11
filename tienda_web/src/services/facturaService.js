import api from './api'


export const getFacturas = async () => (await api.get('/facturas')).data
export const getFacturaById = async (id) => (await api.get(`/facturas/${id}`)).data
export const createFactura = async (data) => (await api.post('/facturas', data)).data
export const deleteFactura = async (id) => (await api.delete(`/facturas/${id}`)).data
