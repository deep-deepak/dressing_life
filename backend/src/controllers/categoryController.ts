import type { Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { ApiError } from '../utils/asyncHandler.js';

export async function listCategories(_req: Request, res: Response) {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
}

export async function createCategory(req: Request, res: Response) {
  const category = await Category.create(req.body);
  res.status(201).json(category);
}

export async function updateCategory(req: Request, res: Response) {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) throw new ApiError(404, 'Category not found.');
  res.json(category);
}

export async function deleteCategory(req: Request, res: Response) {
  await Category.findByIdAndDelete(req.params.id);
  res.status(204).end();
}
