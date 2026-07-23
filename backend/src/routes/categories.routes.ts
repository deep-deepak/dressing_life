import { Router } from 'express';
import { Category } from '../models/Category.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  }),
);

router.post(
  '/',
  requireAuth,
  requireRole(...STAFF_ROLES),
  asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  }),
);

router.put(
  '/:id',
  requireAuth,
  requireRole(...STAFF_ROLES),
  asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) throw new ApiError(404, 'Category not found.');
    res.json(category);
  }),
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(...STAFF_ROLES),
  asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }),
);

export default router;
