import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Imports de tes modules
import authRoutes from './auth/auth.routes.js';
import notificationRoutes from './notifications/notification.routes.js';
import { protect } from './auth/auth.middleware.js';
import { connectDatabase } from './database/connection.js';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const httpServer = createServer(app);

// 1. Configuration Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 2. LIAISON CRUCIALE : On rend 'io' accessible dans les contrôleurs via req.app.get('io')
app.set('io', io);

// 3. Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Logger pour le debug (Optionnel mais très utile)
app.use((req, res, next) => {
  console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 5. Connexion Base de données
connectDatabase();

// 6. Définition des Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', protect, notificationRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 7. Gestion des WebSockets (Logique de Room)
io.on('connection', (socket) => {
  // Récupération de l'ID utilisateur (passé via query ou auth)
  const userId = socket.handshake.query.userId;

  if (userId && userId !== 'undefined') {
    socket.join(userId);
    console.log(`👤 Utilisateur connecté : ${userId} (Room rejointe)`);
  } else {
    console.log('⚠️ Un client s\'est connecté sans userId');
  }

  socket.on('disconnect', () => {
    console.log('🔌 Client déconnecté');
  });
});

// 8. Démarrage du serveur
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log('-------------------------------------------');
  console.log(`🚀 SERVEUR OMNI-NOTIFY DÉMARRÉ`);
  console.log(`📡 URL : http://localhost:${PORT}`);
  console.log(`🌍 CORS : ${process.env.FRONTEND_URL || "http://localhost:4200"}`);
  console.log('-------------------------------------------');
});