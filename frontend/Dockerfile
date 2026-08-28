# ── Etapa 1: Build de producción de React ──────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Variable de entorno de build — la URL del backend vía Nginx
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Etapa 2: Servir con Nginx ───────────────────────────────
FROM nginx:1.27-alpine

# Quita la configuración default de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu configuración personalizada (la creamos en el paso 5)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos generados por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]