import api from './api'


export const getProveedores = async () => (await api.get('/proveedores')).data
export const getProveedorById = async (id) => (await api.get(`/proveedores/${id}`)).data
export const createProveedor = async (data) => (await api.post('/proveedores', data)).data
export const updateProveedor = async (id, data) => (await api.put(`/proveedores/${id}`, data)).data
export const deleteProveedor = async (id) => (await api.delete(`/proveedores/${id}`)).data
