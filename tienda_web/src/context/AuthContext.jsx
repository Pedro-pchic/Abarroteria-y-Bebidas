import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import api from '../services/api'

const AuthContext = createContext(null)

function buildUserData(rawUser) {
  if (!rawUser?.username) return rawUser

  const username = String(rawUser.username).trim()
  const role = String(rawUser.role || 'VENTAS').trim().toUpperCase()

  return {
    username,
    role,
    isAdmin: role === 'ADMIN',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const username = localStorage.getItem('username')
      const role = localStorage.getItem('role')
      if (username) {
        setUser(buildUserData({ username, role }))
      } else {
        const saved = localStorage.getItem('user')
        if (saved) {
          const savedUser = buildUserData(JSON.parse(saved))
          localStorage.setItem('username', savedUser.username)
          localStorage.setItem('role', savedUser.role)
          localStorage.removeItem('user')
          setUser(savedUser)
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password })
    const { token } = data
    if (!token) throw new Error('Login sin token')

    const userData = buildUserData({
      username: data.username || username,
      role: data.role,
    })
    localStorage.setItem('token', token)
    localStorage.setItem('username', userData.username)
    localStorage.setItem('role', userData.role)
    localStorage.removeItem('user')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
