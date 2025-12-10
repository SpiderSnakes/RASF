# ================================
# Étape 1 : deps (install des deps)
# ================================
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

# Copie des fichiers nécessaires pour l'install
COPY package.json pnpm-lock.yaml* ./

# Install des dépendances (en prod)
RUN pnpm install --frozen-lockfile

# ================================
# Étape 2 : build
# ================================
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

# On récupère les node_modules de l'étape deps
COPY --from=deps /app/node_modules ./node_modules

# On copie le reste du projet
COPY . .

# Prisma (si tu l'utilises)
RUN pnpm prisma generate || echo "Prisma generate skipped"

# Build de l’app (Next.js)
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# ================================
# Étape 3 : runtime
# ================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copie uniquement ce qui est nécessaire
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "run", "start"]
