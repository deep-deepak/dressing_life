import type { ContactFormValues } from '@/types';
import { simulateDelay } from './simulateDelay';

export async function submitContactForm(values: ContactFormValues): Promise<{ success: boolean }> {
  if (!values.email || !values.message) {
    throw new Error('Email and message are required.');
  }
  return simulateDelay({ success: true }, 600);
}
