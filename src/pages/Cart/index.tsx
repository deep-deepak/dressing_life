import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store';
import { ROUTES, productDetailsPath } from '@/constants/routes';
import { SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/constants/pricing';
import { formatCurrency } from '@/utils';
import { Container, EmptyState, QuantitySelector } from '@/components/ui';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const sub = subtotal();
  const shipping = items.length === 0 || sub >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <Container className="section-y">
        <EmptyState
          icon={<ShoppingBag size={48} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={
            <Link
              to={ROUTES.TSHIRTS}
              className="mt-2 bg-brand-black px-6 py-3 font-display text-sm uppercase tracking-wider text-brand-white hover:bg-brand-red-700"
            >
              Shop T-Shirts
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="section-y">
      <h1 className="mb-10 text-4xl font-semibold sm:text-5xl">Your Cart</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col divide-y divide-brand-gray-200">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 py-6">
              <Link to={productDetailsPath(item.slug)} className="size-24 shrink-0 overflow-hidden bg-brand-gray-100 sm:size-32">
                <img src={item.image} alt={item.name} className="size-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={productDetailsPath(item.slug)} className="font-display uppercase tracking-wide hover:text-brand-red-700">
                      {item.name}
                    </Link>
                    <p className="text-xs text-brand-gray-500">
                      {item.color} / {item.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="text-brand-gray-400 hover:text-brand-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.productId, item.size, item.color, q)}
                  />
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex h-fit flex-col gap-4 border border-brand-gray-200 p-6">
          <h2 className="font-display text-lg uppercase tracking-wide">Order Summary</h2>
          <div className="flex justify-between text-sm text-brand-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(sub)}</span>
          </div>
          <div className="flex justify-between text-sm text-brand-gray-500">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-brand-red-700">
              Add {formatCurrency(SHIPPING_THRESHOLD - sub)} more for free shipping.
            </p>
          )}
          <div className="flex justify-between border-t border-brand-gray-200 pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.CHECKOUT)}
            className="mt-2 h-12 bg-brand-black font-display text-sm uppercase tracking-wider text-brand-white transition-colors hover:bg-brand-red-700"
          >
            Proceed to Checkout
          </button>
          <Link to={ROUTES.TSHIRTS} className="text-center text-xs uppercase tracking-wide text-brand-gray-500 hover:text-brand-black">
            Continue Shopping
          </Link>
        </div>
      </div>
    </Container>
  );
}
