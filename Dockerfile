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

RUN npm run build -- --webpack

# Etapa final liviana de ejecución
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos públicos y la build standalone generada por Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Asegurar que los assets estáticos estén disponibles tanto en raíz como en /web
RUN mkdir -p web/.next && \
    cp -rn public web/ 2>/dev/null || true && \
    cp -rn .next/static web/.next/ 2>/dev/null || true && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["sh", "-c", "if [ -f server.js ]; then node server.js; elif [ -f web/server.js ]; then node web/server.js; else npm start; fi"]
