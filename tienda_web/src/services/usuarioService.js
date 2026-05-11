import api from './api'


export const getUsuarios = async () => (await api.get('/usuarios')).data
export const getUsuarioById = async (id) => (await api.get(`/usuarios/${id}`)).data
export const createUsuario = async (data) => (await api.post('/usuarios', data)).data
export const updateUsuario = async (id, data) => (await api.put(`/usuarios/${id}`, data)).data
export const deleteUsuario = async (id) => (await api.delete(`/usuarios/${id}`)).data
