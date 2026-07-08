import type { LoginPayload, RegisterPayload, User } from '@/types';
import { MOCK_USER } from './mock/user.data';
import { simulateDelay } from './simulateDelay';

export async function login(payload: LoginPayload): Promise<User> {
  if (!payload.email || !payload.password) {
    throw new Error('Email and password are required.');
  }
  return simulateDelay({ ...MOCK_USER, email: payload.email }, 500);
}

export async function register(payload: RegisterPayload): Promise<User> {
  return simulateDelay(
    {
      ...MOCK_USER,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      orders: [],
    },
    500,
  );
}

export async function getCurrentUser(): Promise<User> {
  return simulateDelay(MOCK_USER);
}
