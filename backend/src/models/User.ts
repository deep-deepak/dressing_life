import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const addressSchema = new Schema(
  {
    label: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: Boolean,
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: String,
    avatarUrl: String,
    addresses: { type: [addressSchema], default: [] },
    role: { type: String, enum: ['customer', 'support', 'manager', 'admin'], default: 'customer' },
    status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
    lastLogin: Date,
  },
  { timestamps: true },
);

userSchema.set('toJSON', toJSONOptions);

export const User = model('User', userSchema);
