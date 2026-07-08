import type { InventoryItem } from '@/types';
import { PRODUCTS } from '../products.data';

const skuFor = (id: string) => `DL-${id.replace('p-', '')}`;

export const INVENTORY_ITEMS: InventoryItem[] = PRODUCTS.map((product) => ({
  productId: product.id,
  productName: product.name,
  sku: skuFor(product.id),
  image: product.images[0],
  stock: product.stock,
  reserved: Math.round(product.stock * 0.1),
  lowStockThreshold: 20,
}));
