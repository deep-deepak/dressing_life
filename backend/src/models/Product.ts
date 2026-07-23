import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const productColorSchema = new Schema({ name: String, hex: String }, { _id: false });

const productReviewSchema = new Schema(
  {
    author: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: false },
);
productReviewSchema.set('toJSON', toJSONOptions);

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: Number,
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    fit: { type: String, required: true },
    fabric: { type: String, required: true },
    colors: { type: [productColorSchema], default: [] },
    sizes: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: { type: [productReviewSchema], default: [] },
    isNew: Boolean,
    isBestSeller: Boolean,
    tags: { type: [String], default: [] },
    sku: String,
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    stock: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 20 },
  },
  { timestamps: true },
);

productSchema.set('toJSON', toJSONOptions);

export const Product = model('Product', productSchema);
