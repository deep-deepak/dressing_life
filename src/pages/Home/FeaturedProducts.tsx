import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAsync } from '@/hooks';
import { getFeaturedProducts } from '@/services';
import { ROUTES } from '@/constants/routes';
import { Container, PageLoader, SectionHeading } from '@/components/ui';
import { ProductCard } from '@/components/common';

export function FeaturedProducts() {
  const { data: products, isLoading } = useAsync(() => getFeaturedProducts(4), []);

  return (
    <section className="section-y bg-brand-gray-50">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Handpicked" title="Best Sellers & New Arrivals" />
          <Link
            to={ROUTES.TSHIRTS}
            className="flex shrink-0 items-center gap-2 font-display text-sm uppercase tracking-wider text-brand-black hover:text-brand-red-700"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {products?.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </Container>
    </section>
  );
}
