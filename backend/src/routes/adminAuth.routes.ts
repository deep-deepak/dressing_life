import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { STAFF_ROLES } from '../middleware/auth.js';
import { toPlainJSON } from '../utils/schemaOptions.js';

const router = Router();

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required.');
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !STAFF_ROLES.includes(user.role as (typeof STAFF_ROLES)[number])) {
      throw new ApiError(401, 'Invalid admin email or password.');
    }
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new ApiError(401, 'Invalid admin email or password.');
    }
    user.lastLogin = new Date();
    await user.save();
    const json = toPlainJSON(user);
    delete json.passwordHash;
    const token = jwt.sign({ id: json.id, role: json.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ user: json, token });
  }),
);

export default router;
