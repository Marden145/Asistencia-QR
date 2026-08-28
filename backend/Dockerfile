# ── Etapa 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia solo package.json primero — aprovecha cache de Docker
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el resto del código
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# ── Etapa 2: Producción ─────────────────────────────────────
FROM node:20-alpine AS production

# Crea un usuario sin privilegios — nunca corras como root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copia solo lo necesario desde el builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --chown=nodejs:nodejs . .

# Cambia al usuario sin privilegios
USER nodejs

EXPOSE 3001

# Healthcheck — Docker verifica que el backend responde
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["node", "src/index.js"]