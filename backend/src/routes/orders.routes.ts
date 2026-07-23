import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { getMyOrders, getOrderById, listOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();

router.get('/mine', requireAuth, asyncHandler(getMyOrders));
router.get('/', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(listOrders));
router.get('/:id', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(getOrderById));
router.patch('/:id/status', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(updateOrderStatus));

export default router;
