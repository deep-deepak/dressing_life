import type { AdminCustomer } from '@/types';
import { ADMIN_CUSTOMERS } from '../mock/admin/customers.data';
import { simulateDelay } from '../simulateDelay';

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  return simulateDelay([...ADMIN_CUSTOMERS]);
}

export async function getAdminCustomerById(id: string): Promise<AdminCustomer | undefined> {
  return simulateDelay(ADMIN_CUSTOMERS.find((c) => c.id === id));
}

export async function setCustomerStatus(id: string, status: AdminCustomer['status']): Promise<AdminCustomer> {
  const index = ADMIN_CUSTOMERS.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Customer not found.');
  ADMIN_CUSTOMERS[index] = { ...ADMIN_CUSTOMERS[index], status };
  return simulateDelay(ADMIN_CUSTOMERS[index]);
}
