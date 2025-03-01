FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# Générer le client Prisma puis compiler TypeScript
RUN npx prisma generate
RUN npm run build

# Exposer le port
EXPOSE 8080

# Commande de démarrage
CMD ["npm", "start"]