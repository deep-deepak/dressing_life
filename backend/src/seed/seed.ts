import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Order } from '../models/Order.js';
import { Coupon } from '../models/Coupon.js';
import { Review } from '../models/Review.js';
import { Banner } from '../models/Banner.js';
import { CmsPage } from '../models/CmsPage.js';
import { BlogPost } from '../models/BlogPost.js';
import { Notification } from '../models/Notification.js';
import { Role } from '../models/Role.js';
import { Settings } from '../models/Settings.js';
import {
  SEED_BANNERS,
  SEED_BLOG_POSTS,
  SEED_CATEGORIES,
  SEED_CMS_PAGES,
  SEED_COUPONS,
  SEED_CUSTOMERS,
  SEED_NOTIFICATIONS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_REVIEWS,
  SEED_ROLES,
  SEED_SETTINGS,
  SEED_STAFF,
} from './data.js';

const ADMIN_PASSWORD = 'admin123';
const STAFF_PASSWORD = 'staff123';
const CUSTOMER_PASSWORD = 'customer123';

async function seed() {
  await connectDB();

  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    Order.deleteMany({}),
    Coupon.deleteMany({}),
    Review.deleteMany({}),
    Banner.deleteMany({}),
    CmsPage.deleteMany({}),
    BlogPost.deleteMany({}),
    Notification.deleteMany({}),
    Role.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  console.log('Seeding products...');
  const productByCode = new Map<string, InstanceType<typeof Product>>();
  for (const { code, ...data } of SEED_PRODUCTS) {
    const product = await Product.create(data);
    productByCode.set(code, product);
  }

  console.log('Seeding categories...');
  await Category.insertMany(SEED_CATEGORIES);

  console.log('Seeding staff users...');
  for (const staff of SEED_STAFF) {
    const password = staff.email === 'admin@dressinglife.com' ? ADMIN_PASSWORD : STAFF_PASSWORD;
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ ...staff, passwordHash, lastLogin: new Date(staff.lastLogin) });
  }

  console.log('Seeding customers...');
  const customerPasswordHash = await bcrypt.hash(CUSTOMER_PASSWORD, 10);
  for (const customer of SEED_CUSTOMERS) {
    await User.create({ ...customer, role: 'customer', passwordHash: customerPasswordHash });
  }

  console.log('Seeding orders...');
  for (const order of SEED_ORDERS) {
    const items = order.items.map(({ code, size, color, quantity }) => {
      const product = productByCode.get(code)!;
      return { productId: product.id, name: product.name, image: product.images[0], size, color, quantity, price: product.price };
    });
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 2000 ? 0 : 99;
    await Order.create({
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      placedAt: order.placedAt,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      items,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
    });
  }

  console.log('Seeding coupons...');
  await Coupon.insertMany(SEED_COUPONS);

  console.log('Seeding reviews...');
  for (const { productCode, ...rest } of SEED_REVIEWS) {
    const product = productByCode.get(productCode)!;
    await Review.create({ ...rest, productId: product.id, productName: product.name });
  }

  console.log('Seeding banners...');
  await Banner.insertMany(SEED_BANNERS);

  console.log('Seeding CMS pages & blog posts...');
  await CmsPage.insertMany(SEED_CMS_PAGES);
  await BlogPost.insertMany(SEED_BLOG_POSTS);

  console.log('Seeding notifications...');
  await Notification.insertMany(SEED_NOTIFICATIONS);

  console.log('Seeding roles...');
  await Role.insertMany(SEED_ROLES);

  console.log('Seeding settings...');
  await Settings.create(SEED_SETTINGS);

  console.log('\nSeed complete. Demo credentials:');
  console.log(`  Admin:    admin@dressinglife.com / ${ADMIN_PASSWORD}`);
  console.log(`  Staff:    farah.nadeem@dressinglife.com (etc.) / ${STAFF_PASSWORD}`);
  console.log(`  Customer: aditya.rao@example.com (etc.) / ${CUSTOMER_PASSWORD}`);

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
