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

### Step 1: Install Dependencies

```bash
git clone https://github.com/fudoyoki/ai-portal-mfe-example.git
cd ai-portal-mfe-example
npm install
```

### Step 2: Build Shared Packages (required first!)

```bash
npm run build -w @ai-portal/shared-types
npm run build -w @ai-portal/ui-kit
```

### Step 3: Build MFEs

MFEs must be built before running — Module Federation needs the `remoteEntry.js` file.

```bash
npm run build -w @ai-portal/mfe-dashboard
```

### Step 4: Run the Application (3 terminals)

**Terminal 1 — Shell (main app, dev mode):**
```bash
cd apps/shell
npm run dev
# → http://localhost:3000
```

**Terminal 2 — MFE Dashboard (preview mode, serves built files):**
```bash
cd apps/mfe-dashboard
npm run preview
# → http://localhost:3001
```

**Terminal 3 — BFF API (optional):**
```bash
cd apps/bff
npm run dev
# → http://localhost:4000
```

### Step 5: Verify

1. Open http://localhost:3000
2. Click "Dashboard" in the nav
3. You should see the Dashboard MFE loaded inside the Shell

If you see "Failed to load Dashboard module" → MFE preview isn't running on :3001

---

### ⚠️ Why Preview Mode for MFEs?

Vite Module Federation generates `remoteEntry.js` only at **build time**. So MFEs must be:
1. **Built** (`npm run build`) — creates `dist/assets/remoteEntry.js`
2. **Previewed** (`npm run preview`) — serves the built files on their port

The Shell (host) can run `npm run dev` because it *consumes* remotes, not *exposes* them.

---

### Rebuilding After Changes

| What Changed | What To Do |
|--------------|------------|
| `packages/shared-types` | Rebuild it → rebuild all apps that depend on it |
| `packages/ui-kit` | Rebuild it → rebuild MFEs → restart MFE previews |
| `apps/mfe-dashboard` | Rebuild → restart preview |
| `apps/shell` | Just refresh browser (hot reload works) |
| `apps/bff` | Auto-reloads in watch mode |

---

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

## Docker

### Production Build

```bash
# Build all images
docker-compose build

# Run all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services will be available at:
- Shell: http://localhost:3000
- MFE Dashboard: http://localhost:3001
- BFF: http://localhost:4000

### Development with Docker

```bash
# Run with hot reload (mounts source code)
docker-compose -f docker-compose.dev.yml up
```

### Build Individual Images

```bash
# Build from repo root (context needed for monorepo)
docker build -f apps/shell/Dockerfile -t ai-portal-shell .
docker build -f apps/mfe-dashboard/Dockerfile -t ai-portal-mfe-dashboard .
docker build -f apps/bff/Dockerfile -t ai-portal-bff .
```

### Image Details

| Image | Base | Size (approx) |
|-------|------|---------------|
| Shell | nginx:alpine | ~25MB |
| MFE Dashboard | nginx:alpine | ~20MB |
| BFF | node:22-alpine | ~180MB |

All images use **Alpine Linux** for minimal footprint.

## Tech Stack

- **Frontend:** Vite + React + TypeScript + Tailwind
- **Module Federation:** @originjs/vite-plugin-federation
- **BFF:** NestJS
- **Monorepo:** Turborepo + npm workspaces
- **State:** Zustand (Shell-level)
- **Containers:** Docker + Alpine Linux

## License

MIT
