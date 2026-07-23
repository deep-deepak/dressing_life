import { Router } from 'express';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  }),
);

router.patch(
  '/read-all',
  asyncHandler(async (_req, res) => {
    await Notification.updateMany({}, { isRead: true });
    res.status(204).end();
  }),
);

router.patch(
  '/:id/read',
  asyncHandler(async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(204).end();
  }),
);

export default router;
