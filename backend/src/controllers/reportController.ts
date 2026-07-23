import type { Request, Response } from 'express';
import { computeCategoryBreakdown, computeCustomerGrowth, computeSalesTrend } from '../utils/analytics.js';

export async function getSalesReport(_req: Request, res: Response) {
  res.json(await computeSalesTrend());
}

export async function getCategoryReport(_req: Request, res: Response) {
  res.json(await computeCategoryBreakdown());
}

export async function getCustomerGrowth(_req: Request, res: Response) {
  res.json(await computeCustomerGrowth());
}
