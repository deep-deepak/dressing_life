import type { OrderStatus } from '@/types';
import { Badge } from '@/components/ui';

const STATUS_VARIANT: Record<OrderStatus, 'dark' | 'red' | 'outline'> = {
  processing: 'outline',
  shipped: 'dark',
  delivered: 'red',
  cancelled: 'outline',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={STATUS_VARIANT[status]} className="capitalize">{status}</Badge>;
}
