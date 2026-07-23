import { Router } from 'express';
import { Product } from '../models/Product.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { toPlainJSON } from '../utils/schemaOptions.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

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

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const products = await Product.find().sort({ name: 1 });
    res.json(products.map(toInventoryItem));
  }),
);

router.patch(
  '/:productId/adjust',
  asyncHandler(async (req, res) => {
    const delta = Number(req.body.delta ?? 0);
    const product = await Product.findById(req.params.productId);
    if (!product) throw new ApiError(404, 'Product not found.');
    product.stock = Math.max(0, product.stock + delta);
    await product.save();
    res.json(toInventoryItem(product));
  }),
);

export default router;
