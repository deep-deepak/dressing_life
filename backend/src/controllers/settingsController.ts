import type { Request, Response } from 'express';
import { Settings } from '../models/Settings.js';

export async function getSettings(_req: Request, res: Response) {
  const settings = await Settings.findOne();
  res.json(settings);
}

export async function updateSettings(req: Request, res: Response) {
  const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json(settings);
}
