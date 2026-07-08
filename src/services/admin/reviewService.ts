import type { AdminReview, ReviewStatus } from '@/types';
import { ADMIN_REVIEWS } from '../mock/admin/reviews.data';
import { simulateDelay } from '../simulateDelay';

export async function getAdminReviews(): Promise<AdminReview[]> {
  return simulateDelay([...ADMIN_REVIEWS]);
}

export async function moderateReview(id: string, status: ReviewStatus): Promise<AdminReview> {
  const index = ADMIN_REVIEWS.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Review not found.');
  ADMIN_REVIEWS[index] = { ...ADMIN_REVIEWS[index], status };
  return simulateDelay(ADMIN_REVIEWS[index]);
}

export async function deleteReview(id: string): Promise<void> {
  const index = ADMIN_REVIEWS.findIndex((r) => r.id === id);
  if (index !== -1) ADMIN_REVIEWS.splice(index, 1);
  return simulateDelay(undefined);
}
