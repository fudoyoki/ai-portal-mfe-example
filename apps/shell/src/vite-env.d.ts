/// <reference types="vite/client" />

// Module Federation remote types
declare module 'mfeDashboard/DashboardApp' {
  import type { MfeProps } from '@ai-portal/shared-types'
  const DashboardApp: React.ComponentType<MfeProps>
  export default DashboardApp
}

declare module 'mfeChat/ChatApp' {
  import type { MfeProps } from '@ai-portal/shared-types'
  const ChatApp: React.ComponentType<MfeProps>
  export default ChatApp
}

declare module 'mfeTools/ToolsApp' {
  import type { MfeProps } from '@ai-portal/shared-types'
  const ToolsApp: React.ComponentType<MfeProps>
  export default ToolsApp
}

declare module 'mfeAdmin/AdminApp' {
  import type { MfeProps } from '@ai-portal/shared-types'
  const AdminApp: React.ComponentType<MfeProps>
  export default AdminApp
}
