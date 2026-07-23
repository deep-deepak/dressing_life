import { Router } from 'express';
import { Role } from '../models/Role.js';
import { PERMISSIONS } from '../data/permissions.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json(await Role.find().sort({ name: 1 }));
  }),
);

router.get('/permissions', (_req, res) => {
  res.json(PERMISSIONS);
});

router.post(
  '/',
  asyncHandler(async (req, res) => {
    res.status(201).json(await Role.create({ ...req.body, usersCount: 0 }));
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) throw new ApiError(404, 'Role not found.');
    res.json(role);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await Role.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }),
);

export default router;
