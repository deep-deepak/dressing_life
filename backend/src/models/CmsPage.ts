import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const cmsPageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  },
  { timestamps: true },
);

cmsPageSchema.set('toJSON', {
  ...toJSONOptions,
  transform: (doc: unknown, ret: Record<string, unknown>) => {
    toJSONOptions.transform(doc, ret);
    ret.updatedAt = (ret.updatedAt as Date)?.toISOString().slice(0, 10) ?? ret.updatedAt;
    return ret;
  },
});

export const CmsPage = model('CmsPage', cmsPageSchema);
