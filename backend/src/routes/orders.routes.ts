import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { createOrder, getMyOrders, getOrderById, listOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();

router.post('/', requireAuth, asyncHandler(createOrder));
router.get('/mine', requireAuth, asyncHandler(getMyOrders));
router.get('/', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(listOrders));
router.get('/:id', requireAuth, asyncHandler(getOrderById));
router.patch('/:id/status', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(updateOrderStatus));

export default router;
