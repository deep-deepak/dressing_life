import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/store';
import { ROUTES, productDetailsPath } from '@/constants/routes';
import { formatCurrency } from '@/utils';
import { Container, EmptyState } from '@/components/ui';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <Container className="section-y">
        <EmptyState
          icon={<Heart size={48} />}
          title="Your wishlist is empty"
          description="Save the T-shirts you love and shop them later."
          action={
            <Link
              to={ROUTES.TSHIRTS}
              className="mt-2 bg-brand-black px-6 py-3 font-display text-sm uppercase tracking-wider text-brand-white hover:bg-brand-red-700"
            >
              Discover T-Shirts
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="section-y">
      <h1 className="mb-10 text-4xl font-semibold sm:text-5xl">Your Wishlist</h1>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.productId} className="group relative flex flex-col">
            <button
              type="button"
              aria-label="Remove from wishlist"
              onClick={() => removeItem(item.productId)}
              className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center bg-brand-white/90 text-brand-black hover:bg-brand-white"
            >
              <X size={14} />
            </button>
            <Link to={productDetailsPath(item.slug)} className="block aspect-[4/5] overflow-hidden bg-brand-gray-100">
              <img src={item.image} alt={item.name} className="size-full object-cover" />
            </Link>
            <div className="mt-3 flex flex-col gap-1">
              <Link to={productDetailsPath(item.slug)} className="font-display text-sm uppercase tracking-wide hover:text-brand-red-700">
                {item.name}
              </Link>
              <span className="text-sm font-semibold">{formatCurrency(item.price)}</span>
            </div>
            <button
              type="button"
              onClick={() =>
                addToCart({
                  productId: item.productId,
                  slug: item.slug,
                  name: item.name,
                  image: item.image,
                  price: item.price,
                  size: 'M',
                  color: 'Default',
                  quantity: 1,
                })
              }
              className="mt-3 h-10 border border-brand-black font-display text-xs uppercase tracking-wider transition-colors hover:bg-brand-black hover:text-brand-white"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
}
