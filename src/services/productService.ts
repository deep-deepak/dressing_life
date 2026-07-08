import type { Product, ProductFilters } from '@/types';
import { PRODUCTS, CATEGORIES } from './mock/products.data';
import { simulateDelay } from './simulateDelay';

// Swap the body of each function for an `api.get(...)` call once the
// product API is available — the signatures are already API-shaped.

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let results = [...PRODUCTS];

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters.color) {
    results = results.filter((p) => p.colors.some((c) => c.name === filters.color));
  }
  if (filters.size) {
    results = results.filter((p) => p.sizes.includes(filters.size!));
  }
  if (filters.minPrice != null) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }

  switch (filters.sortBy) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      results.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
  }

  return simulateDelay(results);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return simulateDelay(PRODUCTS.find((p) => p.slug === slug));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  ).slice(0, limit);
  return simulateDelay(related);
}

export async function getCategories(): Promise<string[]> {
  return simulateDelay([...CATEGORIES]);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const featured = PRODUCTS.filter((p) => p.isBestSeller || p.isNew).slice(0, limit);
  return simulateDelay(featured);
}

export interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  fit: string;
  fabric: string;
  sku?: string;
  stock: number;
  status?: 'active' | 'draft' | 'archived';
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const newProduct: Product = {
    id: `p-${crypto.randomUUID().slice(0, 8)}`,
    images: [],
    colors: [],
    sizes: [],
    rating: 0,
    reviewCount: 0,
    reviews: [],
    tags: [],
    ...payload,
  };
  PRODUCTS.unshift(newProduct);
  return simulateDelay(newProduct);
}

export async function updateProduct(id: string, payload: ProductPayload): Promise<Product> {
  const index = PRODUCTS.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Product not found.');
  PRODUCTS[index] = { ...PRODUCTS[index], ...payload };
  return simulateDelay(PRODUCTS[index]);
}

export async function deleteProduct(id: string): Promise<void> {
  const index = PRODUCTS.findIndex((p) => p.id === id);
  if (index !== -1) PRODUCTS.splice(index, 1);
  return simulateDelay(undefined);
}
