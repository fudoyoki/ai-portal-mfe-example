import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

const isDev = process.env.NODE_ENV !== 'production'

// Port mapping - STRICT ports for each app
const PORTS = {
  shell: 3000,
  mfeDashboard: 3001,
  mfeChat: 3002,
  mfeTools: 3003,
  mfeAdmin: 3004,
}

// Remote URLs - different for dev vs production
const getRemoteUrl = (name: keyof typeof PORTS) => {
  if (isDev) {
    return `http://localhost:${PORTS[name]}/assets/remoteEntry.js`
  }
  // Production: load from CDN
  return `${process.env.CDN_URL || 'https://cdn.example.com'}/${name}/remoteEntry.js`
}

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        mfeDashboard: getRemoteUrl('mfeDashboard'),
        // Add more MFEs as they're created:
        // mfeChat: getRemoteUrl('mfeChat'),
        // mfeTools: getRemoteUrl('mfeTools'),
        // mfeAdmin: getRemoteUrl('mfeAdmin'),
      },
      // IMPORTANT: Shared packages must be installed on the Shell (host)
      // MFEs will use these versions at runtime instead of bundling their own
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.0.0',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.0.0',
        },
        // Share the UI kit - MFEs won't bundle their own copy
        '@ai-portal/ui-kit': {
          singleton: true,
        },
        '@ai-portal/shared-types': {
          singleton: true,
        },
      },
    }),
  ],
  server: {
    port: PORTS.shell,
    strictPort: true, // Fail if port is taken
    cors: true,
  },
  preview: {
    port: PORTS.shell,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    minify: true,
    cssCodeSplit: false,
  },
})
