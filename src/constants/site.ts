import type { NavLink } from '@/types';
import { ROUTES } from './routes';

export const SITE_CONFIG = {
  name: 'Dressing Life',
  tagline: 'Wear Your Story',
  description:
    'Dressing Life crafts premium, everyday T-shirts built on comfort, quality fabric, and bold design.',
  email: 'support@dressinglife.com',
  phone: '+91 98765 43210',
  address: '221 Kadhi Road, Wardha, Maharashtra, India',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
  },
};

export const MAIN_NAV_LINKS: NavLink[] = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'T-Shirts', path: ROUTES.TSHIRTS },
  { label: 'About Us', path: ROUTES.ABOUT },
  { label: 'Contact Us', path: ROUTES.CONTACT },
];

export const FOOTER_LINKS = {
  shop: [
    { label: 'All T-Shirts', path: ROUTES.TSHIRTS },
    { label: 'New Arrivals', path: `${ROUTES.TSHIRTS}?sortBy=newest` },
    { label: 'Best Sellers', path: `${ROUTES.TSHIRTS}?filter=best-sellers` },
  ],
  company: [
    { label: 'About Us', path: ROUTES.ABOUT },
    { label: 'Contact Us', path: ROUTES.CONTACT },
  ],
  account: [
    { label: 'My Profile', path: ROUTES.PROFILE },
    { label: 'Wishlist', path: ROUTES.WISHLIST },
    { label: 'Cart', path: ROUTES.CART },
  ],
};
