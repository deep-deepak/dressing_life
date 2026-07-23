import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export async function computeSalesTrend(monthsBack = 7) {
  const orders = await Order.find({ status: { $ne: 'cancelled' } });
  const now = new Date();
  const buckets: { key: string; label: string; revenue: number; orders: number }[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: monthKey(d), label: MONTH_LABELS[d.getMonth()], revenue: 0, orders: 0 });
  }

  const byKey = new Map(buckets.map((b) => [b.key, b]));
  for (const order of orders) {
    const createdAt = order.get('createdAt') as Date;
    const bucket = byKey.get(monthKey(createdAt));
    if (bucket) {
      bucket.revenue += order.total;
      bucket.orders += 1;
    }
  }

  return buckets.map(({ label, revenue, orders: orderCount }) => ({ label, revenue, orders: orderCount }));
}

export async function computeCategoryBreakdown() {
  const [orders, products] = await Promise.all([Order.find({ status: { $ne: 'cancelled' } }), Product.find()]);
  const categoryById = new Map(products.map((p) => [p.id, p.category]));
  const totals = new Map<string, number>();

  for (const order of orders) {
    for (const item of order.items) {
      const category = categoryById.get(item.productId) ?? 'Other';
      totals.set(category, (totals.get(category) ?? 0) + item.price * item.quantity);
    }
  }

  return Array.from(totals.entries()).map(([category, value]) => ({ category, value: Math.round(value) }));
}

export async function computeCustomerGrowth(monthsBack = 7) {
  const customers = await User.find({ role: 'customer' });
  const now = new Date();
  const windowStart = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);

  const buckets: { key: string; label: string }[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: monthKey(d), label: MONTH_LABELS[d.getMonth()] });
  }

  const joinCounts = new Map<string, number>();
  let cumulative = 0;
  for (const customer of customers) {
    const createdAt = customer.get('createdAt') as Date;
    if (createdAt < windowStart) {
      cumulative += 1;
    } else {
      const key = monthKey(createdAt);
      joinCounts.set(key, (joinCounts.get(key) ?? 0) + 1);
    }
  }

  return buckets.map((b) => {
    cumulative += joinCounts.get(b.key) ?? 0;
    return { label: b.label, customers: cumulative };
  });
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export async function computeDashboardStats() {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthOrders, lastMonthOrders, totalProducts, thisMonthCustomers, lastMonthCustomers, totalCustomers] =
    await Promise.all([
      Order.find({ createdAt: { $gte: startOfThisMonth }, status: { $ne: 'cancelled' } }),
      Order.find({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }, status: { $ne: 'cancelled' } }),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer', createdAt: { $gte: startOfThisMonth } }),
      User.countDocuments({ role: 'customer', createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } }),
      User.countDocuments({ role: 'customer' }),
    ]);

  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + o.total, 0);
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]).then((r) => r[0]?.total ?? 0);
  const totalOrders = await Order.countDocuments({ status: { $ne: 'cancelled' } });

  return {
    totalRevenue,
    revenueChangePct: pctChange(thisMonthRevenue, lastMonthRevenue),
    totalOrders,
    ordersChangePct: pctChange(thisMonthOrders.length, lastMonthOrders.length),
    totalCustomers,
    customersChangePct: pctChange(thisMonthCustomers, lastMonthCustomers),
    totalProducts,
    productsChangePct: 0,
  };
}
