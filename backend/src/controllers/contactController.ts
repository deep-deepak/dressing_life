import type { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage.js';
import { ApiError } from '../utils/asyncHandler.js';

export async function submitContactMessage(req: Request, res: Response) {
  const { name, email, subject, message } = req.body;
  if (!email || !message) {
    throw new ApiError(400, 'Email and message are required.');
  }
  await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ success: true });
}
