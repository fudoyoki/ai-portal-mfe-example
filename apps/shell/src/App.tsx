import React, { Suspense } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Spinner } from '@ai-portal/ui-kit'
import { AuthProvider, useAuth } from './context/AuthContext'

// Lazy load MFEs - they're loaded from remote servers at runtime
const DashboardApp = React.lazy(() => import('mfeDashboard/DashboardApp'))

// Fallback for loading state
function MfeLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
      <span className="ml-3 text-gray-500">Loading module...</span>
    </div>
  )
}

// Error boundary for MFE loading failures
class MfeErrorBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; name: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-600 font-medium">
            Failed to load {this.props.name} module
          </p>
          <p className="text-gray-500 mt-2">
            Make sure the MFE is running on its designated port
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => this.setState({ hasError: false })}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Main layout with navigation
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/chat', label: 'Chat' },
    { path: '/tools', label: 'Tools' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-blue-600">AI Portal</h1>
            <nav className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-500">Not logged in</span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500">
        AI Portal — MFE Architecture Demo
      </footer>
    </div>
  )
}

// Home page (part of Shell)
function HomePage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to AI Portal
      </h2>
      <p className="text-gray-600 mb-8">
        A micro-frontend architecture demo with Vite + React + Module Federation
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/dashboard"
          className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <h3 className="font-semibold text-gray-900">Dashboard</h3>
          <p className="text-sm text-gray-500 mt-1">View your stats</p>
        </Link>
        <Link
          to="/chat"
          className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <h3 className="font-semibold text-gray-900">Chat</h3>
          <p className="text-sm text-gray-500 mt-1">Talk to AI</p>
        </Link>
      </div>
    </div>
  )
}

// Placeholder for MFEs not yet implemented
function ComingSoon({ name }: { name: string }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-400">{name}</h2>
      <p className="text-gray-500 mt-2">Coming soon...</p>
    </div>
  )
}

// Main App component
export function App() {
  const { user } = useAuth()

  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard/*"
            element={
              <MfeErrorBoundary name="Dashboard">
                <Suspense fallback={<MfeLoader />}>
                  <DashboardApp user={user} basePath="/dashboard" />
                </Suspense>
              </MfeErrorBoundary>
            }
          />
          <Route path="/chat/*" element={<ComingSoon name="Chat MFE" />} />
          <Route path="/tools/*" element={<ComingSoon name="Tools MFE" />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}
