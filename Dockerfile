# =============================================================================
# Dockerfile pour l'application RASF
# Optimisé pour le déploiement avec Coolify
# =============================================================================

# -----------------------------------------------------------------------------
# Étape 1 : Installation des dépendances
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci

# Générer le client Prisma
RUN npx prisma generate

# -----------------------------------------------------------------------------
# Étape 2 : Build de l'application
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copier les dépendances installées
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de l'application
RUN npm run build

# -----------------------------------------------------------------------------
# Étape 3 : Image de production
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Copier le build standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copier le client Prisma généré
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Commande de démarrage
CMD ["node", "server.js"]

