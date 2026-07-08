export interface InventoryItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  stock: number;
  reserved: number;
  lowStockThreshold: number;
}
