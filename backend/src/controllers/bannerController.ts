import type { Request, Response } from 'express';
import { Banner } from '../models/Banner.js';
import { ApiError } from '../utils/asyncHandler.js';

export async function listBanners(_req: Request, res: Response) {
  const banners = await Banner.find().sort({ order: 1 });
  res.json(banners);
}

export async function createBanner(req: Request, res: Response) {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
}

export async function updateBanner(req: Request, res: Response) {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!banner) throw new ApiError(404, 'Banner not found.');
  res.json(banner);
}

export async function deleteBanner(req: Request, res: Response) {
  await Banner.findByIdAndDelete(req.params.id);
  res.status(204).end();
}
