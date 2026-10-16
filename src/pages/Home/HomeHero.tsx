import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES, productDetailsPath } from '@/constants/routes';
import { getFeaturedProducts } from '@/services';
import { useAsync } from '@/hooks';
import { cn } from '@/utils';

const SLIDE_INTERVAL_MS = 3500;
const FAN_DEPTH = 4;

function HeroSlider() {
  const { data: products } = useAsync(() => getFeaturedProducts(6), []);
  const [index, setIndex] = useState(0);
  const slides = products?.filter((p) => p.images[0]) ?? [];

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center border border-brand-charcoal bg-brand-charcoal/40">
        <span className="font-display text-9xl font-bold text-brand-white/5">DL</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {slides.map((product, i) => {
        const total = slides.length;
        const depth = (i - index + total) % total;
        if (depth >= FAN_DEPTH) return null;

        return (
          <Link
            key={product.id}
            to={productDetailsPath(product.slug)}
            style={{
              transform: `rotate(${depth * 11}deg) translate(${depth * 14}%, ${depth * 3}%) scale(${1 - depth * 0.05})`,
              transformOrigin: 'bottom left',
              zIndex: FAN_DEPTH - depth,
              opacity: depth === 0 ? 1 : 0.92 - depth * 0.12,
            }}
            className="absolute inset-0 overflow-hidden rounded-md border-[6px] border-brand-white shadow-2xl transition-all duration-700 ease-in-out"
          >
            <img src={product.images[0]} alt={product.name} className="size-full object-cover" />
            {depth === 0 && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="font-display text-sm uppercase tracking-wide text-brand-white">{product.name}</p>
              </div>
            )}
          </Link>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute bottom-3 right-3 z-50 flex gap-1.5">
          {slides.map((product, i) => (
            <button
              key={product.id}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-5 bg-brand-white' : 'w-1.5 bg-brand-white/40')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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
          <HeroSlider />
        </div>
      </div>
    </section>
  );
}
