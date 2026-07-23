import type { Request, Response } from 'express';
import { Review } from '../models/Review.js';
import { ApiError } from '../utils/asyncHandler.js';

export async function listReviews(_req: Request, res: Response) {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
}

export async function moderateReview(req: Request, res: Response) {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!review) throw new ApiError(404, 'Review not found.');
  res.json(review);
}

export async function deleteReview(req: Request, res: Response) {
  await Review.findByIdAndDelete(req.params.id);
  res.status(204).end();
}
