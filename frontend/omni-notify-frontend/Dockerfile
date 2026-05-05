FROM node:20-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    # Pour Angular, on expose le port 4200
    EXPOSE 4200
    CMD ["npm", "start", "--", "--host", "0.0.0.0"]