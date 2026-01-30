# AI Portal — Micro-Frontend Architecture Example

A complete example of a micro-frontend architecture using **Vite + React + Module Federation**, with a **NestJS BFF** (Backend for Frontend).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           BROWSER                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    🏠 SHELL (Host)                         │  │
│  │              Auth · Routing · Layout · State               │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │  │
│  │  │  Dashboard  │ │    Chat     │ │   Tools     │  ...    │  │
│  │  │    MFE      │ │    MFE      │ │    MFE      │         │  │
│  │  │  (remote)   │ │  (remote)   │ │  (remote)   │         │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              📦 SHARED PACKAGES (via Federation)           │  │
│  │         @ai-portal/ui-kit · @ai-portal/shared-types        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        🔀 BFF (NestJS)                           │
│                   /api/auth · /api/chat · ...                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🤖 AI BACKEND SERVICE                       │
└─────────────────────────────────────────────────────────────────┘
```

## Port Mapping (STRICT)

| App | Port | Description |
|-----|------|-------------|
| Shell | 3000 | Host container |
| MFE Dashboard | 3001 | Analytics & widgets |
| MFE Chat | 3002 | AI chat interface |
| MFE Tools | 3003 | AI tools |
| MFE Admin | 3004 | Admin panel |
| BFF | 4000 | API gateway |

Ports are **strictly enforced** — apps will fail to start if their port is taken.

## Getting Started

```bash
# Install dependencies (from root)
npm install

# Build shared packages first
npm run build --workspace=@ai-portal/ui-kit
npm run build --workspace=@ai-portal/shared-types

# Start all apps in development mode
npm run dev
```

Or run individually:

```bash
# Terminal 1: Shell
cd apps/shell && npm run dev

# Terminal 2: Dashboard MFE
cd apps/mfe-dashboard && npm run dev

# Terminal 3: BFF
cd apps/bff && npm run dev
```

Then open http://localhost:3000

## Project Structure

```
ai-portal-mfe/
├── apps/
│   ├── shell/              # Host container (port 3000)
│   ├── mfe-dashboard/      # Dashboard MFE (port 3001)
│   └── bff/                # NestJS BFF (port 4000)
├── packages/
│   ├── ui-kit/             # Shared UI components
│   └── shared-types/       # Shared TypeScript types
├── turbo.json              # Turborepo config
└── package.json            # Workspace root
```

## Key Concepts

### Module Federation

MFEs expose components that the Shell loads at runtime:

```typescript
// MFE: vite.config.ts
federation({
  name: 'mfeDashboard',
  exposes: {
    './DashboardApp': './src/DashboardApp.tsx',
  },
  shared: { react: { singleton: true } }
})

// Shell: loads MFE dynamically
const DashboardApp = React.lazy(() => import('mfeDashboard/DashboardApp'))
```

### Shared Packages

Packages listed in `shared` are **provided by the Shell** at runtime. MFEs don't bundle their own copies.

**Rule:** Shared packages must be installed on the Shell (host).

```typescript
shared: {
  react: { singleton: true, requiredVersion: '^18.0.0' },
  '@ai-portal/ui-kit': { singleton: true },
}
```

### Hot Refresh Limitation

Changes in remote MFEs won't trigger hot refresh in the Shell. Workarounds:
1. Manually refresh the Shell browser tab
2. Develop MFEs in standalone mode first

## Deployment

### Static Assets to CDN

```bash
# Build all apps
npm run build

# Upload to CDN
aws s3 sync apps/shell/dist/ s3://cdn/shell/
aws s3 sync apps/mfe-dashboard/dist/ s3://cdn/mfe-dashboard/
```

### Environment Variables

```bash
# Production: Set CDN_URL for remote URLs
CDN_URL=https://cdn.example.com npm run build
```

## SonarQube Integration

Each app has independent quality metrics. See `sonar-project.properties` in each app directory.

```bash
# Run analysis for an app
cd apps/mfe-dashboard
npm run test:coverage
sonar-scanner
```

## Adding a New MFE

1. Copy `apps/mfe-dashboard` as template
2. Update `name` in `package.json` and `vite.config.ts`
3. Change port in `vite.config.ts` (use next available)
4. Add remote to Shell's `vite.config.ts`
5. Add type declaration to Shell's `src/vite-env.d.ts`

## Tech Stack

- **Frontend:** Vite + React + TypeScript + Tailwind
- **Module Federation:** @originjs/vite-plugin-federation
- **BFF:** NestJS
- **Monorepo:** Turborepo + npm workspaces
- **State:** Zustand (Shell-level)

## License

MIT
