import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { getCustomerById, listCustomers, setCustomerStatus } from '../controllers/customerController.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get('/', asyncHandler(listCustomers));
router.get('/:id', asyncHandler(getCustomerById));
router.patch('/:id/status', asyncHandler(setCustomerStatus));

export default router;
