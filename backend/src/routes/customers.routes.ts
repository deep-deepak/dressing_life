import { Router } from 'express';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { toPlainJSON } from '../utils/schemaOptions.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

async function toAdminCustomer(user: InstanceType<typeof User>) {
  const stats = await Order.aggregate([
    { $match: { customerEmail: user.email } },
    { $group: { _id: null, totalOrders: { $sum: 1 }, totalSpent: { $sum: '$total' } } },
  ]);
  const json = toPlainJSON(user);
  return {
    id: json.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    totalOrders: stats[0]?.totalOrders ?? 0,
    totalSpent: stats[0]?.totalSpent ?? 0,
    joinedAt: (user.get('createdAt') as Date).toISOString().slice(0, 10),
    status: user.status === 'blocked' ? 'blocked' : 'active',
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    res.json(await Promise.all(customers.map(toAdminCustomer)));
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const customer = await User.findOne({ _id: req.params.id, role: 'customer' });
    if (!customer) throw new ApiError(404, 'Customer not found.');
    res.json(await toAdminCustomer(customer));
  }),
);

router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const customer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'customer' },
      { status: req.body.status },
      { new: true },
    );
    if (!customer) throw new ApiError(404, 'Customer not found.');
    res.json(await toAdminCustomer(customer));
  }),
);

export default router;
