import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    permissions: { type: [String], default: [] },
    usersCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

roleSchema.set('toJSON', toJSONOptions);

export const Role = model('Role', roleSchema);
