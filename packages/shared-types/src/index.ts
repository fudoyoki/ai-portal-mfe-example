// Shared Types across all MFEs and BFF

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
}

export interface AuthContext {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

export interface DashboardStats {
  totalChats: number
  tokensUsed: number
  favoriteTools: string[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// MFE Props - passed from Shell to MFEs
export interface MfeProps {
  user: User | null
  basePath: string
}
