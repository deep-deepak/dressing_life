import type { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/asyncHandler.js';
import { toPlainJSON } from '../utils/schemaOptions.js';

function toInventoryItem(product: InstanceType<typeof Product>) {
  const json = toPlainJSON(product);
  return {
    productId: json.id,
    productName: product.name,
    sku: product.sku ?? `DL-${json.id.slice(-6)}`,
    image: product.images[0] ?? '',
    stock: product.stock,
    reserved: product.reserved,
    lowStockThreshold: product.lowStockThreshold,
  };
}

export async function listInventory(_req: Request, res: Response) {
  const products = await Product.find().sort({ name: 1 });
  res.json(products.map(toInventoryItem));
}

export async function adjustStock(req: Request, res: Response) {
  const delta = Number(req.body.delta ?? 0);
  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError(404, 'Product not found.');
  product.stock = Math.max(0, product.stock + delta);
  await product.save();
  res.json(toInventoryItem(product));
}
