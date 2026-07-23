import type { Product, ProductFilters } from '@/types';
import { api } from './api';

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products', { params: filters });
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data } = await api.get<Product | null>(`/products/${slug}`);
  return data ?? undefined;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { data } = await api.get<Product[]>(`/products/${product.id}/related`, { params: { limit } });
  return data;
}

export async function getCategories(): Promise<string[]> {
  const { data } = await api.get<{ name: string }[]>('/categories');
  return data.map((c) => c.name);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products', { params: { featured: true, limit } });
  return data;
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
  const { data } = await api.post<Product>('/products', payload);
  return data;
}

export async function updateProduct(id: string, payload: ProductPayload): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
