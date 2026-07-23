import type { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';
import { ApiError } from '../utils/asyncHandler.js';

function deriveStatus(payload: { startDate: string; endDate: string }) {
  const today = new Date().toISOString().slice(0, 10);
  if (today < payload.startDate) return 'scheduled';
  if (today > payload.endDate) return 'expired';
  return 'active';
}

export async function listCoupons(_req: Request, res: Response) {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
}

export async function createCoupon(req: Request, res: Response) {
  const coupon = await Coupon.create({ ...req.body, status: deriveStatus(req.body) });
  res.status(201).json(coupon);
}

export async function updateCoupon(req: Request, res: Response) {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { ...req.body, status: deriveStatus(req.body) },
    { new: true },
  );
  if (!coupon) throw new ApiError(404, 'Coupon not found.');
  res.json(coupon);
}

export async function deleteCoupon(req: Request, res: Response) {
  await Coupon.findByIdAndDelete(req.params.id);
  res.status(204).end();
}

export async function toggleCouponStatus(req: Request, res: Response) {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found.');
  coupon.status = coupon.status === 'disabled' ? (deriveStatus(coupon) as typeof coupon.status) : 'disabled';
  await coupon.save();
  res.json(coupon);
}
