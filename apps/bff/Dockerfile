# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY apps/bff/package.json apps/bff/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source
COPY apps/bff/ ./

# Build
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files and install production deps only
COPY apps/bff/package.json apps/bff/package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

# Copy built app
COPY --from=builder /app/dist ./dist

# Switch to non-root user
USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

CMD ["node", "dist/main.js"]
