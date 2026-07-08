import type { Banner } from '@/types';
import { placeholderImage } from '@/utils';

const shot = (label: string, background: string) => placeholderImage({ label, width: 1600, height: 600, background });

export const ADMIN_BANNERS: Banner[] = [
  {
    id: 'bn-001',
    title: 'Monsoon Sale — Up to 40% Off',
    imageUrl: shot('MONSOON SALE', '7a0f0f'),
    link: '/t-shirts?sortBy=price-asc',
    position: 'homepage-hero',
    order: 1,
    status: 'active',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
  },
  {
    id: 'bn-002',
    title: 'New Arrivals — Graphic Collection',
    imageUrl: shot('NEW ARRIVALS', '0a0a0a'),
    link: '/t-shirts?category=Graphic',
    position: 'homepage-hero',
    order: 2,
    status: 'active',
  },
  {
    id: 'bn-003',
    title: 'Free Shipping Over ₹2000',
    imageUrl: shot('FREE SHIPPING', '2b2b2b'),
    position: 'homepage-promo',
    order: 1,
    status: 'active',
  },
  {
    id: 'bn-004',
    title: 'Oversized Fits Spotlight',
    imageUrl: shot('OVERSIZED FITS', '1a1a1a'),
    link: '/t-shirts?category=Oversized',
    position: 'category-top',
    order: 1,
    status: 'inactive',
  },
];
