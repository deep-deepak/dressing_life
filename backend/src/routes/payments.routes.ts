import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js';

const router = Router();

router.post('/razorpay/order', requireAuth, asyncHandler(createRazorpayOrder));
router.post('/razorpay/verify', requireAuth, asyncHandler(verifyRazorpayPayment));

export default router;
