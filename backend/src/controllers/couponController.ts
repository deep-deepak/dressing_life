import type { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';
import { ApiError } from '../utils/asyncHandler.js';
import { deriveStatus, resolveCouponDiscount } from '../utils/couponRules.js';

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

export async function validateCoupon(req: Request, res: Response) {
  const { code, subtotal } = req.body as { code?: string; subtotal?: number };
  if (!code || typeof subtotal !== 'number') {
    throw new ApiError(400, 'code and subtotal are required.');
  }
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
  if (!coupon) throw new ApiError(404, 'Invalid coupon code.');
  const discount = resolveCouponDiscount(coupon, subtotal);
  res.json({ code: coupon.code, type: coupon.type, value: coupon.value, discount });
}
