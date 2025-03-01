FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# Générer le build
RUN npm run build

# Exposer le port
EXPOSE 8080

# Commande de démarrage
CMD ["node", "dist/index.js"]