import { Routes, Route } from 'react-router-dom'
import { Card, Button } from '@ai-portal/ui-kit'
import type { MfeProps, DashboardStats } from '@ai-portal/shared-types'

// Mock stats for demo
const MOCK_STATS: DashboardStats = {
  totalChats: 42,
  tokensUsed: 125000,
  favoriteTools: ['Summarizer', 'Translator', 'Code Helper'],
}

function StatsCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

function DashboardHome({ user }: Pick<MfeProps, 'user'>) {
  const stats = MOCK_STATS

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Guest'}
        </h2>
        <p className="text-gray-500 mt-1">Here's your AI usage overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Chats" value={stats.totalChats} />
        <StatsCard 
          title="Tokens Used" 
          value={stats.tokensUsed.toLocaleString()} 
        />
        <StatsCard 
          title="Favorite Tool" 
          value={stats.favoriteTools[0] || 'None yet'} 
        />
      </div>

      {/* Quick actions */}
      <Card title="Quick Actions">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">New Chat</Button>
          <Button variant="secondary">Browse Tools</Button>
          <Button variant="ghost">View History</Button>
        </div>
      </Card>

      {/* Recent activity */}
      <Card title="Recent Activity">
        <div className="space-y-3">
          {[
            { action: 'Chat session', time: '2 hours ago' },
            { action: 'Used Summarizer', time: '5 hours ago' },
            { action: 'Chat session', time: 'Yesterday' },
          ].map((item, i) => (
            <div 
              key={i} 
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-700">{item.action}</span>
              <span className="text-sm text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function DashboardSettings() {
  return (
    <Card title="Dashboard Settings">
      <p className="text-gray-500">Configure your dashboard preferences here.</p>
      <div className="mt-4">
        <Button variant="secondary">Save Changes</Button>
      </div>
    </Card>
  )
}

// Main exported component - this is what the Shell imports
export default function DashboardApp({ user, basePath: _basePath }: MfeProps) {
  return (
    <div className="dashboard-mfe">
      <Routes>
        <Route path="/" element={<DashboardHome user={user} />} />
        <Route path="/settings" element={<DashboardSettings />} />
      </Routes>
    </div>
  )
}
