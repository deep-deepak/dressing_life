import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { put } from '@vercel/blob';
import { connectDB } from '../config/db.js';
import { Product } from '../models/Product.js';

const LOCAL_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');

function contentTypeFor(ext: string) {
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

async function run() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set in backend/.env');
  }

  await connectDB();

  const files = await fs.readdir(LOCAL_DIR);
  const urlByFilename = new Map<string, string>();

  for (const file of files) {
    const buffer = await fs.readFile(path.join(LOCAL_DIR, file));
    const ext = path.extname(file).toLowerCase();
    const blobName = `products/${Date.now()}-${crypto.randomUUID()}${ext}`;
    const blob = await put(blobName, buffer, { access: 'public', contentType: contentTypeFor(ext) });
    urlByFilename.set(file, blob.url);
    console.log(`Uploaded ${file} -> ${blob.url}`);
  }

  const products = await Product.find({ images: { $regex: 'localhost' } });
  for (const product of products) {
    const newImages = product.images.map((url) => {
      const filename = url.split('/').pop()!;
      return urlByFilename.get(filename) ?? url;
    });
    product.images = newImages;
    await product.save();
    console.log(`Updated images for: ${product.name}`);
  }

  console.log(`\nDone. Uploaded ${urlByFilename.size} images, updated ${products.length} products.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
