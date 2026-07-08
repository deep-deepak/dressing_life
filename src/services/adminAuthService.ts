import type { User } from '@/types';
import { simulateDelay } from './simulateDelay';

// Mock credential — swap for a real `api.post('/admin/login', ...)` call once the auth API is available.
const MOCK_ADMIN_CREDENTIAL = { email: 'admin@dressinglife.com', password: 'admin123' };

export async function loginAdmin(payload: { email: string; password: string }): Promise<User> {
  if (payload.email !== MOCK_ADMIN_CREDENTIAL.email || payload.password !== MOCK_ADMIN_CREDENTIAL.password) {
    throw new Error('Invalid admin email or password.');
  }

  const adminUser: User = {
    id: 'au-001',
    firstName: 'Martin',
    lastName: 'Sequeira',
    email: payload.email,
    addresses: [],
    orders: [],
    role: 'admin',
  };

  return simulateDelay(adminUser, 500);
}
