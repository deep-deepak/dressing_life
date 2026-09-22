import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const draftItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const draftSchema = new Schema(
  {
    items: { type: [draftItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: String,
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
  },
  { _id: false },
);

const paymentIntentSchema = new Schema({
  razorpayOrderId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['created', 'processing', 'completed', 'failed'], default: 'created' },
  amount: { type: Number, required: true },
  draft: { type: draftSchema, required: true },
  createdAt: { type: Date, default: Date.now, expires: 1800 },
});

paymentIntentSchema.set('toJSON', toJSONOptions);

export const PaymentIntent = model('PaymentIntent', paymentIntentSchema);
