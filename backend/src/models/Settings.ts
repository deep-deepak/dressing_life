import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const settingsSchema = new Schema(
  {
    storeName: { type: String, required: true },
    supportEmail: { type: String, required: true },
    supportPhone: { type: String, required: true },
    currency: { type: String, required: true },
    taxRatePct: { type: Number, required: true },
    flatShippingFee: { type: Number, required: true },
    freeShippingThreshold: { type: Number, required: true },
    logoUrl: { type: String, default: '' },
    socialLinks: {
      instagram: String,
      facebook: String,
      twitter: String,
    },
  },
  { timestamps: true },
);

settingsSchema.set('toJSON', toJSONOptions);

export const Settings = model('Settings', settingsSchema);
