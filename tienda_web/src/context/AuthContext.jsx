import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)
const adminUsers = new Set(
  (import.meta.env.VITE_ADMIN_USERS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
)

function buildUserData(rawUser) {
  if (!rawUser?.username) return rawUser

  const username = String(rawUser.username).trim()
  const role = rawUser.role || (adminUsers.has(username.toLowerCase()) ? 'ADMIN' : 'EMPLEADO')

  return {
    ...rawUser,
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
    const saved = localStorage.getItem('user')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      if (saved) {
        setUser(buildUserData(JSON.parse(saved)))
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      { username, password }
    )
    const { token } = data
    const userData = buildUserData({ username })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
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
