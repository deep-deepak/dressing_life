import type { Banner, BannerPayload } from '@/types';
import { ADMIN_BANNERS } from '../mock/admin/banners.data';
import { simulateDelay } from '../simulateDelay';

export async function getBanners(): Promise<Banner[]> {
  return simulateDelay([...ADMIN_BANNERS].sort((a, b) => a.order - b.order));
}

export async function createBanner(payload: BannerPayload): Promise<Banner> {
  const newBanner: Banner = { id: `bn-${crypto.randomUUID().slice(0, 8)}`, ...payload };
  ADMIN_BANNERS.push(newBanner);
  return simulateDelay(newBanner);
}

export async function updateBanner(id: string, payload: BannerPayload): Promise<Banner> {
  const index = ADMIN_BANNERS.findIndex((b) => b.id === id);
  if (index === -1) throw new Error('Banner not found.');
  ADMIN_BANNERS[index] = { ...ADMIN_BANNERS[index], ...payload };
  return simulateDelay(ADMIN_BANNERS[index]);
}

export async function deleteBanner(id: string): Promise<void> {
  const index = ADMIN_BANNERS.findIndex((b) => b.id === id);
  if (index !== -1) ADMIN_BANNERS.splice(index, 1);
  return simulateDelay(undefined);
}
