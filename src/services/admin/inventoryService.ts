import type { InventoryItem } from '@/types';
import { api } from '../api';

export async function getInventory(): Promise<InventoryItem[]> {
  const { data } = await api.get<InventoryItem[]>('/inventory');
  return data;
}

export async function adjustStock(productId: string, delta: number): Promise<InventoryItem> {
  const { data } = await api.patch<InventoryItem>(`/inventory/${productId}/adjust`, { delta });
  return data;
}
