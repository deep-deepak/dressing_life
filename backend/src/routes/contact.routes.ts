import { Router } from 'express';
import { ContactMessage } from '../models/ContactMessage.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!email || !message) {
      throw new ApiError(400, 'Email and message are required.');
    }
    await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true });
  }),
);

export default router;
