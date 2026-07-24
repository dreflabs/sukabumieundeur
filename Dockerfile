# =============================================================================
# SUKABUMI EUNDEUR — Production Dockerfile
# Multi-stage build: deps → builder → runner
# =============================================================================

# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install

# Stage 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time env vars (non-secret)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Skip ESLint and type check during Docker build (caught in CI separately)
ENV NEXT_DISABLE_ESLINT_CHECK=1

RUN npm run build

# Stage 3: Production runner (minimal image)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only what's needed
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
