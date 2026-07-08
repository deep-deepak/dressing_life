import type { AdminOrder, OrderStatus } from '@/types';
import { ADMIN_ORDERS } from '../mock/admin/orders.data';
import { simulateDelay } from '../simulateDelay';

export interface AdminOrderFilters {
  status?: OrderStatus;
  search?: string;
}

export async function getAdminOrders(filters: AdminOrderFilters = {}): Promise<AdminOrder[]> {
  let results = [...ADMIN_ORDERS];

  if (filters.status) {
    results = results.filter((o) => o.status === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q),
    );
  }

  return simulateDelay(results.sort((a, b) => b.placedAt.localeCompare(a.placedAt)));
}

export async function getAdminOrderById(id: string): Promise<AdminOrder | undefined> {
  return simulateDelay(ADMIN_ORDERS.find((o) => o.id === id));
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<AdminOrder> {
  const index = ADMIN_ORDERS.findIndex((o) => o.id === id);
  if (index === -1) throw new Error('Order not found.');
  ADMIN_ORDERS[index] = { ...ADMIN_ORDERS[index], status };
  return simulateDelay(ADMIN_ORDERS[index]);
}
