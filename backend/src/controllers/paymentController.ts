import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { razorpay } from '../config/razorpay.js';
import { PaymentIntent } from '../models/PaymentIntent.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/asyncHandler.js';
import { buildOrderDraft, commitOrder } from './orderController.js';

export async function createRazorpayOrder(req: Request, res: Response) {
  const user = await User.findById(req.user!.id);
  if (!user) throw new ApiError(404, 'User not found.');

  const draft = await buildOrderDraft(user, req.body);
  const amount = Math.round(draft.total * 100);

  const rpOrder = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `dl_${user.id}_${Date.now()}`,
  });

  await PaymentIntent.create({
    razorpayOrderId: rpOrder.id,
    userId: user.id,
    amount,
    draft,
  });

  res.json({ razorpayOrderId: rpOrder.id, amount, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID });
}

function isValidSignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

export async function verifyRazorpayPayment(req: Request, res: Response) {
  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = req.body as { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string };

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, 'Missing payment details.');
  }
  if (!isValidSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    throw new ApiError(400, 'Payment verification failed.');
  }

  const claimed = await PaymentIntent.findOneAndUpdate(
    { razorpayOrderId, status: 'created' },
    { $set: { status: 'processing' } },
  );

  if (!claimed) {
    const existingOrder = await Order.findOne({ razorpayOrderId });
    if (existingOrder) {
      res.status(200).json(existingOrder);
      return;
    }
    throw new ApiError(409, 'This payment is already being processed or has expired.');
  }

  if (claimed.userId.toString() !== req.user!.id) {
    throw new ApiError(403, 'You do not have permission to complete this payment.');
  }

  const user = await User.findById(req.user!.id);
  if (!user) throw new ApiError(404, 'User not found.');

  let paymentMethod = 'Razorpay';
  try {
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (payment.method) paymentMethod = payment.method;
  } catch {
    // fall back to 'Razorpay' — don't let a lookup hiccup block an already-verified payment
  }

  try {
    const order = await commitOrder(user, claimed.draft, {
      paymentMethod,
      paymentStatus: 'paid',
      razorpayOrderId,
      razorpayPaymentId,
      couponFailureMode: 'ignore',
    });
    claimed.status = 'completed';
    await claimed.save();
    res.status(201).json(order);
  } catch {
    claimed.status = 'failed';
    await claimed.save();
    await razorpay.payments.refund(razorpayPaymentId, { amount: claimed.amount }).catch(() => {});
    await Notification.create({
      type: 'system',
      title: 'Payment refund needed',
      message: `Refund initiated for payment ${razorpayPaymentId} — order could not be fulfilled (stock).`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    throw new ApiError(
      502,
      "Payment succeeded but we couldn't complete your order. A refund has been initiated and should appear in 5-7 business days. Please contact support if it doesn't.",
    );
  }
}
