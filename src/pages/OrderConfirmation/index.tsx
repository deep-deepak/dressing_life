import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { getOrderById } from '@/services';
import { useAsync } from '@/hooks';
import { ROUTES } from '@/constants/routes';
import { formatCurrency } from '@/utils';
import { Container, Button, EmptyState, PageLoader } from '@/components/ui';
import { OrderStatusBadge } from '@/pages/MyProfile/OrderStatusBadge';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useAsync(() => getOrderById(id!), [id]);

  if (isLoading) {
    return (
      <Container className="section-y">
        <PageLoader />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="section-y">
        <EmptyState
          title="Order not found"
          description="We couldn't find that order. It may have been placed on a different device or browser."
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
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={48} className="text-brand-red-700" />
        <h1 className="text-3xl font-semibold sm:text-4xl">Order Placed!</h1>
        <p className="text-sm text-brand-gray-500">
          Thanks, {order.customerName.split(' ')[0]} — your order has been placed successfully.
        </p>
      </div>

      <div className="mx-auto flex max-w-xl flex-col gap-6 border border-brand-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-brand-gray-400">Order ID</p>
            <p className="font-medium">{order.id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-xs text-brand-gray-500">Placed on {order.placedAt}</p>

        <div className="flex flex-col divide-y divide-brand-gray-200">
          {order.items.map((item, index) => (
            <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="flex justify-between gap-4 py-3 text-sm">
              <span className="text-brand-gray-500">
                {item.name} ({item.color} / {item.size}) × {item.quantity}
              </span>
              <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-brand-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          {!!order.discount && (
            <div className="flex justify-between text-brand-red-700">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-brand-gray-500">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-brand-gray-200 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-brand-gray-200 pt-4 text-sm">
          <p className="text-xs uppercase text-brand-gray-400">Shipping Address</p>
          <p className="text-brand-gray-500">{order.shippingAddress}</p>
        </div>

        <div className="flex items-center justify-between border-t border-brand-gray-200 pt-4 text-sm">
          <span className="text-brand-gray-500">Payment Method</span>
          <span className="font-medium">
            {order.paymentMethod} · <span className="capitalize">{order.paymentStatus}</span>
          </span>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
        <Link to={ROUTES.TSHIRTS} className="flex-1">
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </Link>
        <Link to={ROUTES.PROFILE} className="flex-1">
          <Button className="w-full">View My Orders</Button>
        </Link>
      </div>
    </Container>
  );
}
