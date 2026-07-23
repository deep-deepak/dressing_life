import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/asyncHandler.js';
import { toPlainJSON } from '../utils/schemaOptions.js';

function toAdminUser(user: InstanceType<typeof User>) {
  const json = toPlainJSON(user);
  return {
    id: json.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    status: user.status === 'inactive' ? 'inactive' : 'active',
    avatarUrl: user.avatarUrl,
    lastLogin: user.lastLogin ? user.lastLogin.toISOString().slice(0, 10) : undefined,
    createdAt: (user.get('createdAt') as Date).toISOString().slice(0, 10),
  };
}

export async function listAdminUsers(_req: Request, res: Response) {
  const staff = await User.find({ role: { $ne: 'customer' } }).sort({ createdAt: -1 });
  res.json(staff.map(toAdminUser));
}

export async function createAdminUser(req: Request, res: Response) {
  const { name, email, role, status } = req.body;
  if (!name || !email || !role) throw new ApiError(400, 'name, email, and role are required.');
  const [firstName, ...rest] = name.split(' ');
  const lastName = rest.join(' ') || '-';
  const passwordHash = await bcrypt.hash(Math.random().toString(36).slice(2) + 'Aa1!', 10);
  const user = await User.create({ firstName, lastName, email, passwordHash, role, status });
  res.status(201).json(toAdminUser(user));
}

export async function updateAdminUser(req: Request, res: Response) {
  const { name, email, role, status } = req.body;
  const update: Record<string, unknown> = { email, role, status };
  if (name) {
    const [firstName, ...rest] = name.split(' ');
    update.firstName = firstName;
    update.lastName = rest.join(' ') || '-';
  }
  const user = await User.findOneAndUpdate({ _id: req.params.id, role: { $ne: 'customer' } }, update, { new: true });
  if (!user) throw new ApiError(404, 'Admin user not found.');
  res.json(toAdminUser(user));
}

export async function deleteAdminUser(req: Request, res: Response) {
  await User.findOneAndDelete({ _id: req.params.id, role: { $ne: 'customer' } });
  res.status(204).end();
}
