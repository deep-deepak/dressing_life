import type { StoreSettings } from '@/types';
import { api } from '../api';

export async function getStoreSettings(): Promise<StoreSettings> {
  const { data } = await api.get<StoreSettings>('/settings');
  return data;
}

export async function updateStoreSettings(payload: StoreSettings): Promise<StoreSettings> {
  const { data } = await api.put<StoreSettings>('/settings', payload);
  return data;
}
