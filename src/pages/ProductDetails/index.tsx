import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Heart, Minus, Plus } from 'lucide-react';
import { useAsync } from '@/hooks';
import { getProductBySlug, getRelatedProducts } from '@/services';
import { useCartStore, useWishlistStore } from '@/store';
import { ROUTES } from '@/constants/routes';
import type { ProductSize } from '@/types';
import { cn } from '@/utils';
import { Container, PageLoader, Rating, SectionHeading } from '@/components/ui';
import { PriceTag, ProductCard } from '@/components/common';
import { ImageGallery } from './ImageGallery';

export default function ProductDetailsPage() {
  const { slug = '' } = useParams();
  const { data: product, isLoading } = useAsync(() => getProductBySlug(slug), [slug]);

  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<ProductSize>();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => (product ? s.isWishlisted(product.id) : false));

  const { data: related } = useAsync(
    () => (product ? getRelatedProducts(product) : Promise.resolve([])),
    [product?.id],
  );

  if (isLoading) return <PageLoader />;
  if (!product) return <Navigate to={ROUTES.NOT_FOUND} replace />;

  const color = selectedColor ?? product.colors[0]?.name;
  const size = selectedSize ?? product.sizes[0];

  const handleAddToCart = () => {
    if (!size || !color) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size,
      color,
      quantity,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Container className="section-y">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ImageGallery images={product.images} alt={product.name} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red-700">
              {product.category}
            </span>
            <h1 className="text-3xl font-semibold sm:text-4xl">{product.name}</h1>
            <Rating value={product.rating} reviewCount={product.reviewCount} />
          </div>

          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />

          <p className="text-sm text-brand-gray-500">{product.description}</p>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-brand-gray-600">
              Color — {color}
            </span>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  style={{ backgroundColor: c.hex }}
                  className={cn(
                    'size-9 rounded-full border-2',
                    color === c.name ? 'border-brand-black' : 'border-brand-gray-200',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-brand-gray-600">
              Size — {size}
            </span>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={cn(
                    'flex size-11 items-center justify-center border text-sm font-medium',
                    size === s
                      ? 'border-brand-black bg-brand-black text-brand-white'
                      : 'border-brand-gray-300 hover:border-brand-black',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex h-12 items-center border border-brand-gray-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-full w-11 items-center justify-center hover:bg-brand-gray-100"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="flex h-full w-11 items-center justify-center hover:bg-brand-gray-100"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="h-12 flex-1 bg-brand-black font-display text-sm uppercase tracking-wider text-brand-white transition-colors hover:bg-brand-red-700"
            >
              {justAdded ? 'Added to Cart' : 'Add to Cart'}
            </button>

            <button
              type="button"
              aria-label="Toggle wishlist"
              onClick={() =>
                toggleWishlist({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.images[0],
                  price: product.price,
                })
              }
              className="flex size-12 shrink-0 items-center justify-center border border-brand-gray-300 hover:border-brand-black"
            >
              <Heart size={18} className={cn(isWishlisted && 'fill-brand-red-700 text-brand-red-700')} />
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-4 border-t border-brand-gray-200 pt-6 text-sm">
            <div>
              <dt className="text-brand-gray-400">Fit</dt>
              <dd className="font-medium">{product.fit}</dd>
            </div>
            <div>
              <dt className="text-brand-gray-400">Fabric</dt>
              <dd className="font-medium">{product.fabric}</dd>
            </div>
          </dl>
        </div>
      </div>

      {related && related.length > 0 && (
        <div className="mt-24 flex flex-col gap-10">
          <SectionHeading eyebrow="Complete the Look" title="You May Also Like" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
