import type { StoreSettings } from '@/types';
import { STORE_SETTINGS } from '../mock/admin/settings.data';
import { simulateDelay } from '../simulateDelay';

export async function getStoreSettings(): Promise<StoreSettings> {
  return simulateDelay({ ...STORE_SETTINGS });
}

export async function updateStoreSettings(payload: StoreSettings): Promise<StoreSettings> {
  Object.assign(STORE_SETTINGS, payload);
  return simulateDelay({ ...STORE_SETTINGS });
}
