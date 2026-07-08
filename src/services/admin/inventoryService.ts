import type { InventoryItem } from '@/types';
import { INVENTORY_ITEMS } from '../mock/admin/inventory.data';
import { simulateDelay } from '../simulateDelay';

export async function getInventory(): Promise<InventoryItem[]> {
  return simulateDelay([...INVENTORY_ITEMS]);
}

export async function adjustStock(productId: string, delta: number): Promise<InventoryItem> {
  const index = INVENTORY_ITEMS.findIndex((i) => i.productId === productId);
  if (index === -1) throw new Error('Inventory item not found.');
  INVENTORY_ITEMS[index] = { ...INVENTORY_ITEMS[index], stock: Math.max(0, INVENTORY_ITEMS[index].stock + delta) };
  return simulateDelay(INVENTORY_ITEMS[index]);
}
