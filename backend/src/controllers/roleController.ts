import type { Request, Response } from 'express';
import { Role } from '../models/Role.js';
import { PERMISSIONS } from '../data/permissions.js';
import { ApiError } from '../utils/asyncHandler.js';

export async function listRoles(_req: Request, res: Response) {
  res.json(await Role.find().sort({ name: 1 }));
}

export function listPermissions(_req: Request, res: Response) {
  res.json(PERMISSIONS);
}

export async function createRole(req: Request, res: Response) {
  res.status(201).json(await Role.create({ ...req.body, usersCount: 0 }));
}

export async function updateRole(req: Request, res: Response) {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!role) throw new ApiError(404, 'Role not found.');
  res.json(role);
}

export async function deleteRole(req: Request, res: Response) {
  await Role.findByIdAndDelete(req.params.id);
  res.status(204).end();
}
