import { Router } from 'express';
import { getNotifications, createNotification ,markAsRead, getHistory,} from './notification.controller.js';

const router = Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.patch('/:id/read', markAsRead);
router.get('/history', getHistory);

export default router; 