import type { AdminReview, ReviewStatus } from '@/types';
import { api } from '../api';

export async function getAdminReviews(): Promise<AdminReview[]> {
  const { data } = await api.get<AdminReview[]>('/reviews');
  return data;
}

export async function moderateReview(id: string, status: ReviewStatus): Promise<AdminReview> {
  const { data } = await api.patch<AdminReview>(`/reviews/${id}/status`, { status });
  return data;
}

export async function deleteReview(id: string): Promise<void> {
  await api.delete(`/reviews/${id}`);
}
