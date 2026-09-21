import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

const TOKEN_KEY = 'dressing-life:auth-token';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user, token) => {
        localStorage.setItem(TOKEN_KEY, token);
        set({ user, isAuthenticated: true });
      },
      updateUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'dressing-life:auth' },
  ),
);
