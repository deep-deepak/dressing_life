import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/asyncHandler.js';
import { toPlainJSON } from '../utils/schemaOptions.js';

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

export async function listCustomers(_req: Request, res: Response) {
  const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
  res.json(await Promise.all(customers.map(toAdminCustomer)));
}

export async function getCustomerById(req: Request, res: Response) {
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' });
  if (!customer) throw new ApiError(404, 'Customer not found.');
  res.json(await toAdminCustomer(customer));
}

export async function setCustomerStatus(req: Request, res: Response) {
  const customer = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'customer' },
    { status: req.body.status },
    { new: true },
  );
  if (!customer) throw new ApiError(404, 'Customer not found.');
  res.json(await toAdminCustomer(customer));
}
