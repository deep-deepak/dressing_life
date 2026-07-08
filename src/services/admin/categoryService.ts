import type { Category, CategoryPayload } from '@/types';
import { ADMIN_CATEGORIES } from '../mock/admin/categories.data';
import { simulateDelay } from '../simulateDelay';

export async function getAdminCategories(): Promise<Category[]> {
  return simulateDelay([...ADMIN_CATEGORIES]);
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const newCategory: Category = {
    id: `c-${crypto.randomUUID().slice(0, 8)}`,
    productCount: 0,
    ...payload,
  };
  ADMIN_CATEGORIES.unshift(newCategory);
  return simulateDelay(newCategory);
}

export async function updateCategory(id: string, payload: CategoryPayload): Promise<Category> {
  const index = ADMIN_CATEGORIES.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Category not found.');
  ADMIN_CATEGORIES[index] = { ...ADMIN_CATEGORIES[index], ...payload };
  return simulateDelay(ADMIN_CATEGORIES[index]);
}

export async function deleteCategory(id: string): Promise<void> {
  const index = ADMIN_CATEGORIES.findIndex((c) => c.id === id);
  if (index !== -1) ADMIN_CATEGORIES.splice(index, 1);
  return simulateDelay(undefined);
}
