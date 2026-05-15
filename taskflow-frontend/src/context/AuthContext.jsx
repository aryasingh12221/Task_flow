import { createContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuth, getToken, getUser, saveToken, saveUser } from '../utils/tokenUtils'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getUser())
    setToken(getToken())
    setLoading(false)
  }, [])

  const login = (nextToken, nextUser) => {
    saveToken(nextToken)
    saveUser(nextUser)
    setToken(nextToken)
    setUser(nextUser)
    navigate('/projects', { replace: true })
  }

  const logout = () => {
    clearAuth()
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    loading
  }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
