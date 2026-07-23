import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const reviewSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    author: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true },
);

reviewSchema.set('toJSON', toJSONOptions);

export const Review = model('Review', reviewSchema);
