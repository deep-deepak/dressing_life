import { Router } from 'express';
import { Product } from '../models/Product.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, color, size, minPrice, maxPrice, sortBy, search, featured, limit } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};

    if (category) query.category = category;
    if (color) query['colors.name'] = color;
    if (size) query.sizes = size;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (search) query.name = { $regex: search, $options: 'i' };
    if (featured === 'true') query.$or = [{ isBestSeller: true }, { isNew: true }];

    let cursor = Product.find(query);

    switch (sortBy) {
      case 'price-asc':
        cursor = cursor.sort({ price: 1 });
        break;
      case 'price-desc':
        cursor = cursor.sort({ price: -1 });
        break;
      case 'rating':
        cursor = cursor.sort({ rating: -1 });
        break;
      case 'newest':
        cursor = cursor.sort({ createdAt: -1 });
        break;
    }
    if (limit) cursor = cursor.limit(Number(limit));

    const products = await cursor;
    res.json(products);
  }),
);

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    res.json(product ?? undefined);
  }),
);

router.get(
  '/:id/related',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json([]);
    const limit = Number(req.query.limit ?? 4);
    const related = await Product.find({ _id: { $ne: product.id }, category: product.category }).limit(limit);
    res.json(related);
  }),
);

router.post(
  '/',
  requireAuth,
  requireRole(...STAFF_ROLES),
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  }),
);

router.put(
  '/:id',
  requireAuth,
  requireRole(...STAFF_ROLES),
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) throw new ApiError(404, 'Product not found.');
    res.json(product);
  }),
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(...STAFF_ROLES),
  asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }),
);

export default router;
