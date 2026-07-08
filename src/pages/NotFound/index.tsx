import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <span className="font-display text-8xl font-bold text-brand-red-700 sm:text-9xl">404</span>
      <h1 className="text-2xl font-semibold sm:text-3xl">Page Not Found</h1>
      <p className="max-w-sm text-sm text-brand-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-2 bg-brand-black px-8 py-3 font-display text-sm uppercase tracking-wider text-brand-white hover:bg-brand-red-700"
      >
        Back to Home
      </Link>
    </Container>
  );
}
