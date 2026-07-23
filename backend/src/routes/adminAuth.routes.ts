import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginAdmin } from '../controllers/adminAuthController.js';

const router = Router();

router.post('/login', asyncHandler(loginAdmin));

export default router;
