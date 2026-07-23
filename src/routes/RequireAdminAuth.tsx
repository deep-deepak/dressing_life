import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store';

export function RequireAdminAuth({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);

  const isStaff = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'support';
  if (!isStaff) {
    return <Navigate to={ADMIN_ROUTES.LOGIN} replace />;
  }

  return children;
}
