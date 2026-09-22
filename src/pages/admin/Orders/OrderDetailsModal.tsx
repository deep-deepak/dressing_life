import type { AdminOrder, OrderStatus } from '@/types';
import { Modal, Select, Badge } from '@/components/ui';
import { formatCurrency } from '@/utils';

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_VARIANT: Record<AdminOrder['paymentStatus'], 'dark' | 'red' | 'outline'> = {
  paid: 'dark',
  pending: 'outline',
  refunded: 'outline',
  failed: 'red',
};

interface OrderDetailsModalProps {
  order?: AdminOrder;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: OrderStatus) => void;
}

export function OrderDetailsModal({ order, isOpen, onClose, onStatusChange }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order ${order.id}`} size="lg">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Customer</p>
            <p className="text-sm">{order.customerName}</p>
            <p className="text-sm text-brand-gray-500">{order.customerEmail}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Placed On</p>
            <p className="text-sm">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Shipping Address</p>
            <p className="text-sm">{order.shippingAddress}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Payment</p>
            <p className="flex items-center gap-2 text-sm">
              {order.paymentMethod} <Badge variant={PAYMENT_VARIANT[order.paymentStatus]}>{order.paymentStatus}</Badge>
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Order Status</p>
            <Select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
              options={STATUS_OPTIONS}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Items</p>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 border-b border-brand-gray-100 pb-3 last:border-0">
              <img src={item.image} alt={item.name} className="size-12 object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-brand-gray-500">
                  {item.color} / {item.size} × {item.quantity}
                </p>
              </div>
              <p className="text-sm">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 border-t border-brand-gray-200 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-gray-500">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-gray-500">Shipping</span>
            <span>{order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
