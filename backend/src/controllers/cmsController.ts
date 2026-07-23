import type { Request, Response } from 'express';
import { CmsPage } from '../models/CmsPage.js';
import { BlogPost } from '../models/BlogPost.js';
import { ApiError } from '../utils/asyncHandler.js';

export async function listCmsPages(_req: Request, res: Response) {
  res.json(await CmsPage.find().sort({ updatedAt: -1 }));
}

export async function createCmsPage(req: Request, res: Response) {
  res.status(201).json(await CmsPage.create(req.body));
}

export async function updateCmsPage(req: Request, res: Response) {
  const page = await CmsPage.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!page) throw new ApiError(404, 'Page not found.');
  res.json(page);
}

export async function deleteCmsPage(req: Request, res: Response) {
  await CmsPage.findByIdAndDelete(req.params.id);
  res.status(204).end();
}

export async function listBlogPosts(_req: Request, res: Response) {
  res.json(await BlogPost.find().sort({ publishedAt: -1 }));
}

export async function createBlogPost(req: Request, res: Response) {
  res.status(201).json(await BlogPost.create(req.body));
}

export async function updateBlogPost(req: Request, res: Response) {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) throw new ApiError(404, 'Blog post not found.');
  res.json(post);
}

export async function deleteBlogPost(req: Request, res: Response) {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.status(204).end();
}
