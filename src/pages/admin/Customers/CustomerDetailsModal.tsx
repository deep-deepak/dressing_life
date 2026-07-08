import type { AdminCustomer } from '@/types';
import { Modal, Badge } from '@/components/ui';
import { formatCurrency } from '@/utils';

const STATUS_VARIANT: Record<AdminCustomer['status'], 'dark' | 'red' | 'outline'> = {
  active: 'dark',
  blocked: 'red',
};

interface CustomerDetailsModalProps {
  customer?: AdminCustomer;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsModal({ customer, isOpen, onClose }: CustomerDetailsModalProps) {
  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Profile" size="md">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          {customer.avatarUrl ? (
            <img src={customer.avatarUrl} alt={customer.name} className="size-16 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-black text-lg font-semibold text-brand-white">
              {customer.name.charAt(0)}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium">{customer.name}</p>
            <p className="text-sm text-brand-gray-500">{customer.email}</p>
            <Badge variant={STATUS_VARIANT[customer.status]} className="w-fit">
              {customer.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-brand-gray-200 pt-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Phone</p>
            <p className="text-sm">{customer.phone ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Joined</p>
            <p className="text-sm">{customer.joinedAt}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Total Orders</p>
            <p className="text-sm">{customer.totalOrders}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">Total Spent</p>
            <p className="text-sm">{formatCurrency(customer.totalSpent)}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
