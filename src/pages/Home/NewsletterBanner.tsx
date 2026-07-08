import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui';

export function NewsletterBanner() {
  return (
    <section className="section-y bg-brand-red-700 text-brand-white">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-xl text-3xl font-semibold sm:text-4xl">Join the Dressing Life Club</h2>
        <p className="max-w-md text-sm text-brand-red-100">
          Get 10% off your first order plus early access to new drops.
        </p>
        <Link
          to={ROUTES.REGISTER}
          className="bg-brand-black px-8 py-4 font-display text-sm uppercase tracking-wider text-brand-white transition-colors hover:bg-brand-charcoal"
        >
          Create an Account
        </Link>
      </Container>
    </section>
  );
}
