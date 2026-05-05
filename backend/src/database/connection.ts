import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://omni-db:27017/omni-notify';

/**
 * Gère la connexion à MongoDB 7.x
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 7.x connecté avec succès');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1); // Arrêt du processus en cas d'échec critique
  }
};

// Gestion de la déconnexion propre (Graceful Shutdown)
mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB déconnecté');
});