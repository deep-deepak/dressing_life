import type { Request, Response } from 'express';
import { Notification } from '../models/Notification.js';

export async function listNotifications(_req: Request, res: Response) {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
}

export async function markAllNotificationsAsRead(_req: Request, res: Response) {
  await Notification.updateMany({}, { isRead: true });
  res.status(204).end();
}

export async function markNotificationAsRead(req: Request, res: Response) {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.status(204).end();
}
