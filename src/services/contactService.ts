import type { ContactFormValues } from '@/types';
import { api } from './api';

export async function submitContactForm(values: ContactFormValues): Promise<{ success: boolean }> {
  const { data } = await api.post<{ success: boolean }>('/contact', values);
  return data;
}
