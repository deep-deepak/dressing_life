import type { Category } from '@/types';
import { placeholderImage } from '@/utils';

const shot = (label: string) => placeholderImage({ label, width: 400, height: 400 });

export const ADMIN_CATEGORIES: Category[] = [
  { id: 'c-001', name: 'Graphic', slug: 'graphic', image: shot('GRAPHIC'), productCount: 3, status: 'active' },
  { id: 'c-002', name: 'Solid', slug: 'solid', image: shot('SOLID'), productCount: 3, status: 'active' },
  { id: 'c-003', name: 'Oversized', slug: 'oversized', image: shot('OVERSIZED'), productCount: 1, status: 'active' },
  { id: 'c-004', name: 'Henley', slug: 'henley', image: shot('HENLEY'), productCount: 1, status: 'active' },
  { id: 'c-005', name: 'Full Sleeve', slug: 'full-sleeve', image: shot('FULL SLEEVE'), productCount: 1, status: 'active' },
  { id: 'c-006', name: 'Limited Edition', slug: 'limited-edition', image: shot('LIMITED'), productCount: 0, status: 'inactive' },
];
