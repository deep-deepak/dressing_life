import { Link, Outlet } from 'react-router-dom';
import { Logo } from '@/components/common';
import { ROUTES } from '@/constants/routes';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-brand-black px-8 py-10 text-brand-white sm:px-14 lg:py-14">
        <Link to={ROUTES.HOME}>
          <Logo theme="dark" />
        </Link>
        <div className="hidden flex-col gap-4 lg:flex">
          <h1 className="max-w-md text-4xl font-semibold leading-tight">
            Everyday tees, built to outlast the everyday.
          </h1>
          <p className="max-w-sm text-sm text-brand-gray-400">
            Join Dressing Life for early access to drops, order tracking, and a wishlist that follows you everywhere.
          </p>
        </div>
        <p className="text-xs text-brand-gray-500">© {new Date().getFullYear()} Dressing Life</p>
      </div>
      <div className="flex items-center justify-center bg-brand-white px-6 py-14">
        <Outlet />
      </div>
    </div>
  );
}
