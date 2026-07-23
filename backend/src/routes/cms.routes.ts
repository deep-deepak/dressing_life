import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import {
  createBlogPost,
  createCmsPage,
  deleteBlogPost,
  deleteCmsPage,
  listBlogPosts,
  listCmsPages,
  updateBlogPost,
  updateCmsPage,
} from '../controllers/cmsController.js';

const router = Router();

router.get('/pages', asyncHandler(listCmsPages));
router.get('/blogs', asyncHandler(listBlogPosts));

router.use(requireAuth, requireRole(...STAFF_ROLES));

router.post('/pages', asyncHandler(createCmsPage));
router.put('/pages/:id', asyncHandler(updateCmsPage));
router.delete('/pages/:id', asyncHandler(deleteCmsPage));

router.post('/blogs', asyncHandler(createBlogPost));
router.put('/blogs/:id', asyncHandler(updateBlogPost));
router.delete('/blogs/:id', asyncHandler(deleteBlogPost));

export default router;
