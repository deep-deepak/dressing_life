export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  fit: string;
  fabric: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  isNew?: boolean;
  isBestSeller?: boolean;
  stock: number;
  tags: string[];
  sku?: string;
  status?: 'active' | 'draft' | 'archived';
}

export interface ProductFilters {
  category?: string;
  color?: string;
  size?: ProductSize;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  search?: string;
}
