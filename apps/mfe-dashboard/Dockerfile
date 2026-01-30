# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy workspace root files
COPY package.json package-lock.json* ./
COPY turbo.json ./

# Copy package sources
COPY packages/ ./packages/
COPY apps/mfe-dashboard/ ./apps/mfe-dashboard/

# Install dependencies
RUN npm install

# Build shared packages first, then MFE
RUN npm run build --workspace=@ai-portal/shared-types
RUN npm run build --workspace=@ai-portal/ui-kit
RUN npm run build --workspace=@ai-portal/mfe-dashboard

# Production stage - serve static files with nginx
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/apps/mfe-dashboard/dist /usr/share/nginx/html

# Copy nginx config
COPY apps/mfe-dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
