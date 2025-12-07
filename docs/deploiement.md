# Guide de deploiement

Ce guide explique comment deployer l'application RASF Cantine en production.

## Prerequis

- Un serveur VPS (Ubuntu 22.04 recommande)
- Docker et Docker Compose installes
- Un nom de domaine configure
- Coolify installe (optionnel mais recommande)

## Option 1 : Deploiement avec Coolify (recommande)

### 1. Preparer Coolify

1. Connectez-vous a votre instance Coolify
2. Creez un nouveau projet "RASF Cantine"
3. Ajoutez une nouvelle ressource de type "Docker Compose"

### 2. Configurer la base de donnees

Dans Coolify, creez d'abord une base de donnees PostgreSQL :

1. Nouvelle ressource > Database > PostgreSQL
2. Configurez les parametres :
   - Nom : `rasf-db`
   - Base de donnees : `rasf_cantine`
   - Utilisateur : `rasf`
   - Mot de passe : (genere automatiquement)
3. Notez l'URL de connexion interne

### 3. Deployer l'application

1. Nouvelle ressource > Application > Docker
2. Source : Git (connectez votre repo)
3. Configurez les variables d'environnement :

```env
DATABASE_URL=postgresql://rasf:PASSWORD@rasf-db:5432/rasf_cantine
NEXTAUTH_SECRET=votre-secret-tres-long-genere-aleatoirement
NEXTAUTH_URL=https://cantine.votre-domaine.com
```

4. Configurez le domaine
5. Activez HTTPS (Let's Encrypt)
6. Deployez

### 4. Initialiser la base de donnees

Apres le premier deploiement, executez dans le conteneur :

```bash
npx prisma db push
npx prisma db seed
```

## Option 2 : Deploiement Docker manuel

### 1. Fichier docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://rasf:password@db:5432/rasf_cantine
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=rasf
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=rasf_cantine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rasf -d rasf_cantine"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
```

### 2. Deployer

```bash
# Copier les fichiers sur le serveur
scp -r . user@serveur:/opt/rasf-cantine

# Se connecter au serveur
ssh user@serveur

# Aller dans le dossier
cd /opt/rasf-cantine

# Creer le fichier .env
cat > .env << EOF
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://cantine.votre-domaine.com
EOF

# Lancer les conteneurs
docker-compose up -d

# Initialiser la base de donnees
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

### 3. Configurer le reverse proxy (Nginx)

```nginx
server {
    listen 80;
    server_name cantine.votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cantine.votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/cantine.votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cantine.votre-domaine.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret pour les sessions | Generer avec `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de l'application | `https://cantine.example.com` |

## Mises a jour

### Avec Coolify

1. Poussez vos modifications sur Git
2. Coolify detecte et redploie automatiquement

### Avec Docker manuel

```bash
cd /opt/rasf-cantine

# Arreter les conteneurs
docker-compose down

# Mettre a jour le code
git pull

# Reconstruire et relancer
docker-compose up -d --build

# Appliquer les migrations si necessaire
docker-compose exec app npx prisma db push
```

## Sauvegardes

### Base de donnees PostgreSQL

```bash
# Sauvegarde
docker-compose exec db pg_dump -U rasf rasf_cantine > backup_$(date +%Y%m%d).sql

# Restauration
cat backup.sql | docker-compose exec -T db psql -U rasf rasf_cantine
```

### Automatiser les sauvegardes (cron)

```bash
# Editer le crontab
crontab -e

# Ajouter (sauvegarde quotidienne a 3h du matin)
0 3 * * * cd /opt/rasf-cantine && docker-compose exec -T db pg_dump -U rasf rasf_cantine > /backups/rasf_$(date +\%Y\%m\%d).sql
```

## Monitoring

### Verifier l'etat des conteneurs

```bash
docker-compose ps
docker-compose logs -f app
```

### Verifier la sante de l'application

```bash
curl -I https://cantine.votre-domaine.com/api/settings
```

## Depannage

### L'application ne demarre pas

1. Verifier les logs : `docker-compose logs app`
2. Verifier la connexion a la BDD
3. Verifier les variables d'environnement

### Erreur de base de donnees

1. Verifier que PostgreSQL est lance : `docker-compose ps db`
2. Verifier l'URL de connexion
3. Relancer Prisma : `docker-compose exec app npx prisma db push`

### Erreur HTTPS/SSL

1. Verifier que le certificat est valide
2. Verifier la configuration Nginx
3. Regenerer le certificat : `certbot renew`

## Securite en production

- [ ] Changer les mots de passe par defaut
- [ ] Generer un nouveau `NEXTAUTH_SECRET`
- [ ] Activer HTTPS obligatoire
- [ ] Configurer un firewall (ufw)
- [ ] Mettre a jour regulierement les dependances
- [ ] Activer les sauvegardes automatiques

