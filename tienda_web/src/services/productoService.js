import api from './api'


export const getProductos = async () => (await api.get('/productos')).data
export const getProductoById = async (id) => (await api.get(`/productos/${id}`)).data
export const createProducto = async (data) => (await api.post('/productos', data)).data
export const updateProducto = async (id, data) => (await api.put(`/productos/${id}`, data)).data
export const deleteProducto = async (id) => (await api.delete(`/productos/${id}`)).data
