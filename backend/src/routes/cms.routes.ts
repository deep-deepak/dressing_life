import { Router } from 'express';
import { CmsPage } from '../models/CmsPage.js';
import { BlogPost } from '../models/BlogPost.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();

router.get(
  '/pages',
  asyncHandler(async (_req, res) => {
    res.json(await CmsPage.find().sort({ updatedAt: -1 }));
  }),
);

router.get(
  '/blogs',
  asyncHandler(async (_req, res) => {
    res.json(await BlogPost.find().sort({ publishedAt: -1 }));
  }),
);

router.use(requireAuth, requireRole(...STAFF_ROLES));

router.post(
  '/pages',
  asyncHandler(async (req, res) => {
    res.status(201).json(await CmsPage.create(req.body));
  }),
);

router.put(
  '/pages/:id',
  asyncHandler(async (req, res) => {
    const page = await CmsPage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) throw new ApiError(404, 'Page not found.');
    res.json(page);
  }),
);

router.delete(
  '/pages/:id',
  asyncHandler(async (req, res) => {
    await CmsPage.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }),
);

router.post(
  '/blogs',
  asyncHandler(async (req, res) => {
    res.status(201).json(await BlogPost.create(req.body));
  }),
);

router.put(
  '/blogs/:id',
  asyncHandler(async (req, res) => {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) throw new ApiError(404, 'Blog post not found.');
    res.json(post);
  }),
);

router.delete(
  '/blogs/:id',
  asyncHandler(async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }),
);

export default router;
