import type { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/asyncHandler.js';
import { computeShippingFee } from '../utils/pricing.js';
import { resolveCouponDiscount } from '../utils/couponRules.js';
import { STAFF_ROLES } from '../middleware/auth.js';

interface CreateOrderItemInput {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderDraftItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface OrderDraft {
  items: OrderDraftItem[];
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  shippingFee: number;
  total: number;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
}

async function rollbackStock(decremented: { productId: string; quantity: number }[]) {
  await Promise.all(
    decremented.map(({ productId, quantity }) => Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } })),
  );
}

export async function buildOrderDraft(
  user: InstanceType<typeof User>,
  { items, addressId, couponCode }: { items?: CreateOrderItemInput[]; addressId?: string; couponCode?: string },
): Promise<OrderDraft> {
  if (!items || items.length === 0) throw new ApiError(400, 'Your cart is empty.');

  const address = user.addresses.id(addressId ?? '');
  if (!address) throw new ApiError(400, 'Selected address was not found on your account.');

  const draftItems: OrderDraftItem[] = [];
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new ApiError(400, 'One or more products in your cart are no longer available.');
    if (product.stock < item.quantity) {
      throw new ApiError(409, `Insufficient stock for "${product.name}". Only ${product.stock} left.`);
    }
    draftItems.push({
      productId: product.id,
      name: product.name,
      image: product.images[0] ?? '',
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const subtotal = draftItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discount = 0;
  let appliedCouponCode: string | undefined;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });
    if (!coupon) throw new ApiError(400, 'Invalid coupon code.');
    discount = resolveCouponDiscount(coupon, subtotal);
    appliedCouponCode = coupon.code;
  }

  const shippingFee = computeShippingFee(subtotal);
  const total = subtotal - discount + shippingFee;
  const shippingAddress = `${address.line1}${address.line2 ? `, ${address.line2}` : ''}, ${address.city}, ${address.state} ${address.postalCode}`;

  return {
    items: draftItems,
    subtotal,
    discount,
    couponCode: appliedCouponCode,
    shippingFee,
    total,
    shippingAddress,
    customerName: `${user.firstName} ${user.lastName}`,
    customerEmail: user.email,
  };
}

export async function commitOrder(
  user: InstanceType<typeof User>,
  draft: OrderDraft,
  options: {
    paymentMethod: string;
    paymentStatus: 'paid' | 'pending';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    couponFailureMode?: 'throw' | 'ignore';
  },
) {
  const { paymentMethod, paymentStatus, razorpayOrderId, razorpayPaymentId, couponFailureMode = 'throw' } = options;

  const decremented: { productId: string; quantity: number }[] = [];
  for (const item of draft.items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true },
    );
    if (!updated) {
      await rollbackStock(decremented);
      throw new ApiError(409, `"${item.name}" just sold out. Please update your cart.`);
    }
    decremented.push({ productId: item.productId, quantity: item.quantity });
  }

  if (draft.couponCode) {
    const bumped = await Coupon.updateOne(
      { code: draft.couponCode, $expr: { $lt: ['$usedCount', '$usageLimit'] } },
      { $inc: { usedCount: 1 } },
    );
    if (bumped.matchedCount === 0) {
      if (couponFailureMode === 'throw') {
        await rollbackStock(decremented);
        throw new ApiError(400, 'This coupon just reached its usage limit.');
      }
      // 'ignore': payment for this discounted total was already captured — don't undo it over a bookkeeping miss.
    }
  }

  const placedAt = new Date().toISOString().slice(0, 10);

  const order = await Order.create({
    userId: user.id,
    customerName: draft.customerName,
    customerEmail: draft.customerEmail,
    placedAt,
    status: 'processing',
    paymentStatus,
    paymentMethod,
    items: draft.items,
    subtotal: draft.subtotal,
    shippingFee: draft.shippingFee,
    total: draft.total,
    shippingAddress: draft.shippingAddress,
    couponCode: draft.couponCode,
    discount: draft.discount,
    razorpayOrderId,
    razorpayPaymentId,
  });

  await Notification.create({
    type: 'order',
    title: 'New order placed',
    message: `${draft.customerName} placed order worth ₹${draft.total}.`,
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return order;
}

export async function createOrder(req: Request, res: Response) {
  const { paymentMethod } = req.body as { paymentMethod?: string };
  if (paymentMethod !== 'Cash on Delivery') {
    throw new ApiError(400, 'Invalid payment method. Use online payment to pay by UPI, card, or net banking.');
  }

  const user = await User.findById(req.user!.id);
  if (!user) throw new ApiError(404, 'User not found.');

  const draft = await buildOrderDraft(user, req.body);
  const order = await commitOrder(user, draft, { paymentMethod: 'Cash on Delivery', paymentStatus: 'pending' });

  res.status(201).json(order);
}

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
  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json(orders);
}

export async function getOrderById(req: Request, res: Response) {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found.');
  const isStaff = STAFF_ROLES.includes(req.user!.role);
  if (!isStaff) {
    const user = await User.findById(req.user!.id);
    if (!user || order.customerEmail !== user.email) {
      throw new ApiError(403, 'You do not have permission to view this order.');
    }
  }
  res.json(order);
}

export async function updateOrderStatus(req: Request, res: Response) {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) throw new ApiError(404, 'Order not found.');
  res.json(order);
}
