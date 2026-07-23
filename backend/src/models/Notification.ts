import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const notificationSchema = new Schema(
  {
    type: { type: String, enum: ['order', 'inventory', 'review', 'system'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: String, required: true },
  },
  { timestamps: false },
);

notificationSchema.set('toJSON', toJSONOptions);

export const Notification = model('Notification', notificationSchema);
