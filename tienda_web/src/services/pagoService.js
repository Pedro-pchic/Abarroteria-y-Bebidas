import api from './api'


export const getPagos = async () => (await api.get('/pagos')).data
export const getPagoById = async (id) => (await api.get(`/pagos/${id}`)).data
export const createPago = async (data) => (await api.post('/pagos', data)).data
export const deletePago = async (id) => (await api.delete(`/pagos/${id}`)).data
