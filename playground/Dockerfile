# Étape de build
FROM node:20-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json* ./

# Installation des dépendances
RUN npm ci

# Copie du reste des fichiers source
COPY . .

# Build de l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copie de la configuration Nginx personnalisée si nécessaire
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers de build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration pour le SPA routing (utile pour les applications front-end modernes)
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
