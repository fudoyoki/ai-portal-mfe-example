import React, { createContext, useContext, useState, useCallback } from 'react'
import type { User, AuthContext as AuthContextType } from '@ai-portal/shared-types'

const AuthContext = createContext<AuthContextType | null>(null)

// Mock user for demo purposes
const MOCK_USER: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'user',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER) // Start logged in for demo
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(() => {
    setIsLoading(true)
    // In real app: redirect to BFF /api/auth/login
    setTimeout(() => {
      setUser(MOCK_USER)
      setIsLoading(false)
    }, 500)
  }, [])

  const logout = useCallback(() => {
    setIsLoading(true)
    // In real app: call BFF /api/auth/logout
    setTimeout(() => {
      setUser(null)
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
