import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/auth.routes.js';
import notificationRoutes from './notifications/notification.routes.js';
import { protect } from './auth/auth.middleware.js';
import { connectDatabase } from './database/connection.js';
// Chargement des variables d'environnement
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configuration Socket.io conforme au README (v4.x)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connexion MongoDB 7.x

// ...
connectDatabase();
// Routes publiques
app.use((req, res, next) => {
    console.log("Données brutes reçues :", req.body);
  console.log(`🔍 Requête entrante : ${req.method} ${req.url}`);
  next();
});
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/notifications', protect, notificationRoutes);
// Route de santé (Healthcheck)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', latency: '< 200ms target' });
});

// Gestion des WebSockets
io.on('connection', (socket) => {
  // Le client enverra son ID lors de la connexion
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their private room`);
  }

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});
// Démarrage du serveur Node.js 20
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});