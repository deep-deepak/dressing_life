import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { toPlainJSON } from '../utils/schemaOptions.js';

const router = Router();

function signToken(user: { id: string; role: string }) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      throw new ApiError(400, 'firstName, lastName, email, and password are required.');
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new ApiError(409, 'An account with this email already exists.');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, passwordHash, role: 'customer' });
    const json = toPlainJSON(user);
    delete json.passwordHash;
    res.status(201).json({ user: json, token: signToken(json as { id: string; role: string }) });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required.');
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new ApiError(401, 'Invalid email or password.');
    }
    user.lastLogin = new Date();
    await user.save();
    const json = toPlainJSON(user);
    delete json.passwordHash;
    res.json({ user: json, token: signToken(json as { id: string; role: string }) });
  }),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, 'User not found.');
    const json = toPlainJSON(user);
    delete json.passwordHash;
    res.json(json);
  }),
);

export default router;
