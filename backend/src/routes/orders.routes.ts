import { Router } from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();

router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, 'User not found.');
    const orders = await Order.find({ customerEmail: user.email }).sort({ createdAt: -1 });
    res.json(orders);
  }),
);

router.get(
  '/',
  requireAuth,
  requireRole(...STAFF_ROLES),
  asyncHandler(async (req, res) => {
    const { status, search } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }
    const orders = await Order.find(query).sort({ placedAt: -1 });
    res.json(orders);
  }),
);

router.get(
  '/:id',
  requireAuth,
  requireRole(...STAFF_ROLES),
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json(order ?? undefined);
  }),
);

router.patch(
  '/:id/status',
  requireAuth,
  requireRole(...STAFF_ROLES),
  asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) throw new ApiError(404, 'Order not found.');
    res.json(order);
  }),
);

export default router;
