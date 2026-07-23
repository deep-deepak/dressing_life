import type { Banner, BannerPayload } from '@/types';
import { api } from '../api';

export async function getBanners(): Promise<Banner[]> {
  const { data } = await api.get<Banner[]>('/banners');
  return data;
}

export async function createBanner(payload: BannerPayload): Promise<Banner> {
  const { data } = await api.post<Banner>('/banners', payload);
  return data;
}

export async function updateBanner(id: string, payload: BannerPayload): Promise<Banner> {
  const { data } = await api.put<Banner>(`/banners/${id}`, payload);
  return data;
}

export async function deleteBanner(id: string): Promise<void> {
  await api.delete(`/banners/${id}`);
}
