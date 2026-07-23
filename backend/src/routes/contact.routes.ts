import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { submitContactMessage } from '../controllers/contactController.js';

const router = Router();

router.post('/', asyncHandler(submitContactMessage));

export default router;
