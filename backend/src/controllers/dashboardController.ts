import type { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { computeCategoryBreakdown, computeDashboardStats, computeSalesTrend } from '../utils/analytics.js';

export async function getDashboardStats(_req: Request, res: Response) {
  res.json(await computeDashboardStats());
}

export async function getSalesTrend(_req: Request, res: Response) {
  res.json(await computeSalesTrend());
}

export async function getCategoryBreakdown(_req: Request, res: Response) {
  res.json(await computeCategoryBreakdown());
}

export async function getRecentOrders(req: Request, res: Response) {
  const limit = Number(req.query.limit ?? 5);
  const orders = await Order.find({}).sort({ placedAt: -1 }).limit(limit);
  res.json(orders);
}
