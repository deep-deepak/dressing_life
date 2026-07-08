import type { BlogPost, CmsPage } from '@/types';
import { placeholderImage } from '@/utils';

const cover = (label: string) => placeholderImage({ label, width: 1200, height: 700, background: '1a1a1a' });

export const CMS_PAGES: CmsPage[] = [
  {
    id: 'pg-001',
    title: 'About Us',
    slug: 'about-us',
    content: 'Dressing Life is a streetwear-first label built on premium cotton basics and bold graphic tees...',
    status: 'published',
    updatedAt: '2026-06-20',
  },
  {
    id: 'pg-002',
    title: 'Shipping & Returns',
    slug: 'shipping-returns',
    content: 'We ship pan-India in 3-5 business days. Returns are accepted within 14 days of delivery...',
    status: 'published',
    updatedAt: '2026-05-14',
  },
  {
    id: 'pg-003',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: 'This policy describes how we collect, use, and protect your personal information...',
    status: 'published',
    updatedAt: '2026-03-02',
  },
  {
    id: 'pg-004',
    title: 'Size Guide',
    slug: 'size-guide',
    content: 'Draft content for an upcoming interactive size guide page...',
    status: 'draft',
    updatedAt: '2026-07-01',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'bl-001',
    title: 'How to Style a Graphic Tee for Every Season',
    slug: 'style-graphic-tee-every-season',
    excerpt: 'From layering in winter to breathable fits in summer, here is how to make your graphic tee work year-round.',
    content: 'Full article body goes here...',
    author: 'Farah Nadeem',
    coverImage: cover('STYLE GUIDE'),
    status: 'published',
    tags: ['style', 'graphic-tees'],
    publishedAt: '2026-06-25',
  },
  {
    id: 'bl-002',
    title: 'The Story Behind Our 240 GSM Cotton',
    slug: 'story-behind-240-gsm-cotton',
    excerpt: 'Why we chose heavyweight cotton for our bestsellers, and what it means for durability.',
    content: 'Full article body goes here...',
    author: 'Devansh Oberoi',
    coverImage: cover('OUR FABRIC'),
    status: 'published',
    tags: ['fabric', 'sustainability'],
    publishedAt: '2026-05-30',
  },
  {
    id: 'bl-003',
    title: 'Oversized vs Regular Fit: Which Should You Buy?',
    slug: 'oversized-vs-regular-fit',
    excerpt: 'A quick breakdown of our two most popular fits to help you pick the right one.',
    content: 'Draft article body goes here...',
    author: 'Farah Nadeem',
    coverImage: cover('FIT GUIDE'),
    status: 'draft',
    tags: ['fit-guide'],
    publishedAt: '2026-07-10',
  },
];
