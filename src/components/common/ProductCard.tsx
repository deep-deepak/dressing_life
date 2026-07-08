import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '@/types';
import { productDetailsPath } from '@/constants/routes';
import { useWishlistStore } from '@/store';
import { cn } from '@/utils';
import { Badge } from '../ui/Badge';
import { Rating } from '../ui/Rating';
import { PriceTag } from './PriceTag';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleItem = useWishlistStore((s) => s.toggleItem);

  return (
    <div className="group relative flex flex-col">
      <Link to={productDetailsPath(product.slug)} className="relative block overflow-hidden bg-brand-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src={product.images[1] ?? product.images[0]}
          alt=""
          aria-hidden
          className="absolute inset-0 aspect-[4/5] w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && <Badge variant="dark">New</Badge>}
          {product.isBestSeller && <Badge variant="red">Best Seller</Badge>}
        </div>
      </Link>

      <button
        type="button"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={() =>
          toggleItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0],
            price: product.price,
          })
        }
        className="absolute right-3 top-3 flex size-9 items-center justify-center bg-brand-white/90 text-brand-black transition-colors hover:bg-brand-white"
      >
        <Heart size={16} className={cn(isWishlisted && 'fill-brand-red-700 text-brand-red-700')} />
      </button>

      <div className="mt-4 flex flex-col gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-brand-gray-400">
          {product.category}
        </span>
        <Link to={productDetailsPath(product.slug)} className="font-display text-base uppercase tracking-wide hover:text-brand-red-700">
          {product.name}
        </Link>
        <Rating value={product.rating} reviewCount={product.reviewCount} />
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
      </div>
    </div>
  );
}
