import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import DashboardApp from './DashboardApp'
import './index.css'

// This is for standalone development of the MFE
// When loaded via Shell, DashboardApp is imported directly

const mockUser = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'user' as const,
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="p-4 bg-yellow-100 text-yellow-800 text-sm mb-4">
        ⚠️ Running in standalone mode. In production, this MFE is loaded into the Shell.
      </div>
      <DashboardApp user={mockUser} basePath="" />
    </BrowserRouter>
  </React.StrictMode>
)
