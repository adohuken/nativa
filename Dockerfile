# Multi-stage Dockerfile para producción de Nativa (Next.js) en Dokploy
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar manifiestos de dependencias de la app web
COPY web/package.json web/package-lock.json ./
RUN npm ci

# Etapa de compilación
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY web ./

# Variables de entorno públicas requeridas en Build Time
ARG NEXT_PUBLIC_APP_NAME="Nativa"
ARG NEXT_PUBLIC_SUPABASE_URL="https://lylffgrqquxeynqqkwmu.supabase.co"
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_RDhQ7TJRyOBBDuVOBsULFA_Wy_qExvh"

ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Etapa final liviana de ejecución
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos públicos y la build standalone de Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
