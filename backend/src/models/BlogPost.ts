import { Schema, model } from 'mongoose';
import { toJSONOptions } from '../utils/schemaOptions.js';

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String, required: true },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    tags: { type: [String], default: [] },
    publishedAt: { type: String, required: true },
  },
  { timestamps: true },
);

blogPostSchema.set('toJSON', toJSONOptions);

export const BlogPost = model('BlogPost', blogPostSchema);
