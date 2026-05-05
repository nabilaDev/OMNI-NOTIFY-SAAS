import { Request, Response } from 'express';
import { Notification } from '../database/models/Notification.js';

console.log('✅ Notification Controller Loaded'); // Pour le debug


export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    // On ne récupère que les notifications NON lues
    const notifications = await Notification.find({ userId, status: 'pending' }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
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
// notification.controller.js

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Récupère l'ID depuis l'URL /:id/read
    const userId = (req as any).user.id;

    // On met à jour seulement si la notif appartient bien à l'utilisateur
    const updatedNotif = await Notification.findOneAndUpdate(
      { _id: id, userId: userId }, 
      { status: 'read', read: true }, // On met à jour le statut et le flag read
      { new: true } // Pour renvoyer l'objet mis à jour
    );

    if (!updatedNotif) {
      return res.status(404).json({ error: 'Notification introuvable' });
    }

    res.json(updatedNotif);
  } catch (error) {
    console.error("Erreur markAsRead:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// notification.controller.js

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    // On récupère toutes les notifications (lues et non-lues) 
    // triées de la plus récente à la plus ancienne
    const history = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // On limite aux 50 dernières pour la performance

    res.json(history);
  } catch (error) {
    console.error("Erreur récupération historique:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};