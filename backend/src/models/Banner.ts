import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const bannerSchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    link: String,
    position: { type: String, enum: ['homepage-hero', 'homepage-promo', 'category-top'], required: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    startDate: String,
    endDate: String,
  },
  { timestamps: true },
);

bannerSchema.set('toJSON', toJSONOptions);

export const Banner = model('Banner', bannerSchema);
