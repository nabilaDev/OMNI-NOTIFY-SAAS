import { Request, Response } from 'express';
import { Notification } from '../database/models/Notification.js';

console.log('✅ Notification Controller Loaded'); // Pour le debug

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const history = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { message, channel } = req.body;

    const newNotif = await Notification.create({
      userId,
      message,
      channel: channel || 'websocket',
      status: 'pending'
    });

    // Émission sécurisée
    const io = req.app.get('io');
    if (io) {
      // On envoie à la "room" spécifique de l'utilisateur
      io.to(userId).emit('notification:new', newNotif);
    }

    res.status(201).json(newNotif);
  } catch (error) {
    console.error("Erreur création notification:", error);
    res.status(400).json({ error: 'Creation failed' });
  }
};