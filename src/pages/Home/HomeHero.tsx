import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-brand-black text-brand-white">
      <div className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-brand-red-900/30 blur-3xl" />
      <div className="container-page relative grid grid-cols-1 items-center gap-10 py-20 lg:grid-cols-2 lg:py-32">
        <div className="flex flex-col gap-6 animate-slide-up">
          <span className="w-fit border border-brand-red-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-red-500">
            New Season Drop
          </span>
          <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            Wear Your
            <span className="block text-brand-red-700">Story.</span>
          </h1>
          <p className="max-w-md text-base text-brand-gray-300">
            Premium, heavyweight T-shirts designed for everyday life — bold graphics, honest fabric, built to last.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to={ROUTES.TSHIRTS}
              className="flex h-14 items-center gap-2 bg-brand-red-700 px-8 font-display text-sm uppercase tracking-wider text-brand-white transition-colors hover:bg-brand-red-800"
            >
              Shop T-Shirts <ArrowRight size={18} />
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="font-display text-sm uppercase tracking-wider text-brand-gray-200 underline decoration-brand-gray-500 underline-offset-8 hover:text-brand-white"
            >
              Our Story
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
          <div className="absolute inset-0 flex items-center justify-center border border-brand-charcoal bg-brand-charcoal/40">
            <span className="font-display text-9xl font-bold text-brand-white/5">DL</span>
          </div>
          <div className="absolute inset-6 border border-brand-red-700/40" />
        </div>
      </div>
    </section>
  );
}
