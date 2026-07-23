import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    minOrderValue: Number,
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, enum: ['active', 'expired', 'scheduled', 'disabled'], default: 'active' },
  },
  { timestamps: true },
);

couponSchema.set('toJSON', toJSONOptions);

export const Coupon = model('Coupon', couponSchema);
