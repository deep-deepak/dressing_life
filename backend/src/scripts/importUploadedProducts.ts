import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { Product } from '../models/Product.js';

const PORT = process.env.PORT ?? 4000;
const BASE_URL = `http://localhost:${PORT}/uploads/products`;
const img = (file: string) => `${BASE_URL}/${file}`;

// Prices marked "CONFIRMED" come from the seller's real Meesho listing screenshot (₹399).
// Everything else is an ESTIMATE based on similar oversized graphic tees — review and
// adjust in the admin Products page before switching status to "active".
const PRODUCTS = [
  {
    slug: 'dressing-life-comic-print-oversized-tee',
    name: 'Dressing Life Comic Print Oversized Tee',
    description:
      'Oversized fit tee in 100% cotton with a bold calligraphy-style graffiti logo on the front and a high-definition DTF comic print across the back.',
    price: 399, // CONFIRMED (Meesho listing)
    images: [
      img('comic-red-hero.jpg'),
      img('comic-red-side.jpg'),
      img('comic-red-detail.jpg'),
      img('comic-black-front.jpg'),
      img('comic-black-back.jpg'),
      img('comic-white-side.jpg'),
      img('comic-white-compare.jpg'),
      img('comic-green-hero.jpg'),
    ],
    category: 'Graphic',
    fit: 'Oversized',
    fabric: '100% Cotton',
    colors: [
      { name: 'Red', hex: '#dc2626' },
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'White', hex: '#ffffff' },
      { name: 'Pista Green', hex: '#b6cf9a' },
    ],
    sizes: ['M', 'L', 'XL'],
    tags: ['graphic', 'oversized', 'streetwear', 'dtf-print'],
    stock: 50,
    status: 'draft',
  },
  {
    slug: 'dragon-fortune-oversized-tee',
    name: 'Dragon Fortune Oversized Tee',
    description:
      'Pista green oversized tee with a small front emblem and a large red-to-black gradient dragon print across the back.',
    price: 399, // ESTIMATE
    images: [
      img('dragon-green-front.jpg'),
      img('dragon-green-back.jpg'),
      img('dragon-green-detail1.jpg'),
      img('dragon-green-compare.jpg'),
      img('dragon-green-detail2.jpg'),
    ],
    category: 'Graphic',
    fit: 'Oversized',
    fabric: '100% Cotton',
    colors: [{ name: 'Pista Green', hex: '#b6cf9a' }],
    sizes: ['M', 'L', 'XL'],
    tags: ['graphic', 'oversized', 'streetwear'],
    stock: 30,
    status: 'draft',
  },
  {
    slug: 'one-piece-luffy-portrait-tee',
    name: 'One Piece Luffy Portrait Tee',
    description: 'Black oversized tee featuring a large front portrait print of Luffy from One Piece.',
    price: 449, // ESTIMATE
    images: [img('luffy-black-compare.jpg'), img('luffy-black-front.jpg')],
    category: 'Graphic',
    fit: 'Oversized',
    fabric: '100% Cotton',
    colors: [{ name: 'Black', hex: '#0a0a0a' }],
    sizes: ['M', 'L', 'XL'],
    tags: ['graphic', 'anime', 'one-piece'],
    stock: 25,
    status: 'draft',
  },
  {
    slug: 'itachi-akatsuki-print-tee',
    name: 'Itachi Akatsuki Print Tee',
    description: 'Sage green oversized tee with an Itachi Uchiha front graphic and a full Akatsuki portrait print on the back.',
    price: 449, // ESTIMATE
    images: [img('itachi-sage-compare.jpg')],
    category: 'Graphic',
    fit: 'Oversized',
    fabric: '100% Cotton',
    colors: [{ name: 'Sage Green', hex: '#b7b08a' }],
    sizes: ['M', 'L', 'XL'],
    tags: ['graphic', 'anime', 'naruto'],
    stock: 25,
    status: 'draft',
  },
  {
    slug: 'hello-kitty-collage-back-print-tee',
    name: 'Hello Kitty Collage Back Print Tee',
    description: 'White tee with a large sticker-collage style back print.',
    price: 399, // ESTIMATE
    images: [img('hellokitty-white-back.jpg')],
    category: 'Graphic',
    fit: 'Regular',
    fabric: '100% Cotton',
    colors: [{ name: 'White', hex: '#ffffff' }],
    sizes: ['M', 'L', 'XL'],
    tags: ['graphic'],
    stock: 20,
    status: 'draft',
  },
  {
    slug: 'spiderman-print-tee',
    name: 'Spiderman Print Tee',
    description: 'White tee with a compact Spiderman graphic placed at the lower front.',
    price: 349, // ESTIMATE
    images: [img('spiderman-white-front.jpg')],
    category: 'Graphic',
    fit: 'Regular',
    fabric: '100% Cotton',
    colors: [{ name: 'White', hex: '#ffffff' }],
    sizes: ['M', 'L', 'XL'],
    tags: ['graphic'],
    stock: 20,
    status: 'draft',
  },
  {
    slug: 'classic-maroon-tee',
    name: 'Classic Maroon Tee',
    description: 'A clean, no-print maroon crew neck tee in soft cotton.',
    price: 299, // ESTIMATE
    images: [img('maroon-plain-back.jpg'), img('maroon-plain-side.jpg')],
    category: 'Solid',
    fit: 'Regular',
    fabric: '100% Cotton',
    colors: [{ name: 'Maroon', hex: '#7f1d1d' }],
    sizes: ['M', 'L', 'XL'],
    tags: ['solid', 'basics'],
    stock: 35,
    status: 'draft',
  },
  {
    slug: 'dressing-life-script-back-print-tee',
    name: 'Dressing Life Script Back Print Tee',
    description: 'Heather grey tee, plain front, with a cursive "Dressing Life!" script print across the back.',
    price: 349, // ESTIMATE
    images: [img('script-grey-front.jpg'), img('script-grey-back.jpg')],
    category: 'Graphic',
    fit: 'Regular',
    fabric: '100% Cotton',
    colors: [{ name: 'Grey', hex: '#9ca3af' }],
    sizes: ['M', 'L', 'XL'],
    tags: ['graphic', 'basics'],
    stock: 30,
    status: 'draft',
  },
];

async function run() {
  await connectDB();

  for (const product of PRODUCTS) {
    const existing = await Product.findOne({ slug: product.slug });
    if (existing) {
      await Product.updateOne({ slug: product.slug }, product);
      console.log(`Updated: ${product.name}`);
    } else {
      await Product.create(product);
      console.log(`Created: ${product.name}`);
    }
  }

  console.log(`\nDone. ${PRODUCTS.length} products imported as drafts — review pricing/stock in the admin panel before publishing.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
