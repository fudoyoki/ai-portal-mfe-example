import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// STRICT PORT - must match Shell's remote config
const PORT = 3001

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfeDashboard',
      filename: 'remoteEntry.js',
      // Expose components that Shell can load
      exposes: {
        './DashboardApp': './src/DashboardApp.tsx',
      },
      // IMPORTANT: Shared packages - these will be provided by the Shell (host)
      // at runtime, so we don't bundle our own copies
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
    port: PORT,
    strictPort: true, // FAIL if port is taken - don't auto-increment
    cors: true,
  },
  preview: {
    port: PORT,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    minify: true,
    cssCodeSplit: false,
  },
})
