import type { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/asyncHandler.js';

export async function getMyOrders(req: Request, res: Response) {
  const user = await User.findById(req.user!.id);
  if (!user) throw new ApiError(404, 'User not found.');
  const orders = await Order.find({ customerEmail: user.email }).sort({ createdAt: -1 });
  res.json(orders);
}

export async function listOrders(req: Request, res: Response) {
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
}

export async function getOrderById(req: Request, res: Response) {
  const order = await Order.findById(req.params.id);
  res.json(order ?? undefined);
}

export async function updateOrderStatus(req: Request, res: Response) {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) throw new ApiError(404, 'Order not found.');
  res.json(order);
}
