import { useState } from 'react';
import { LogOut, MapPin, Package, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useAsync } from '@/hooks';
import { getMyOrders } from '@/services/orderService';
import { formatCurrency } from '@/utils';
import { cn } from '@/utils';
import { Container, PageLoader } from '@/components/ui';
import { OrderStatusBadge } from './OrderStatusBadge';

type Tab = 'profile' | 'orders' | 'addresses';

const TABS: { id: Tab; label: string; icon: typeof UserIcon }[] = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
];

export default function MyProfilePage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { data: orders, isLoading: ordersLoading } = useAsync(() => getMyOrders(), []);

  if (!user) return <PageLoader />;

  return (
    <Container className="section-y">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex size-16 items-center justify-center bg-brand-black font-display text-xl uppercase text-brand-white">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-brand-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-2 border-b border-brand-gray-200 pb-4 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-left text-sm font-medium uppercase tracking-wide text-brand-gray-500 hover:text-brand-black',
                activeTab === id && 'bg-brand-gray-100 text-brand-black',
              )}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-left text-sm font-medium uppercase tracking-wide text-brand-red-700 hover:text-brand-red-800"
          >
            <LogOut size={16} /> Log Out
          </button>
        </nav>

        <div>
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide">Personal Information</h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-brand-gray-400">First Name</dt>
                  <dd className="text-sm font-medium">{user.firstName}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-brand-gray-400">Last Name</dt>
                  <dd className="text-sm font-medium">{user.lastName}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-brand-gray-400">Email</dt>
                  <dd className="text-sm font-medium">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-brand-gray-400">Phone</dt>
                  <dd className="text-sm font-medium">{user.phone ?? '—'}</dd>
                </div>
              </dl>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide">Order History</h2>
              {ordersLoading ? (
                <PageLoader />
              ) : !orders || orders.length === 0 ? (
                <p className="text-sm text-brand-gray-500">You haven't placed any orders yet.</p>
              ) : (
                <div className="flex flex-col divide-y divide-brand-gray-200">
                  {orders.map((order) => (
                    <div key={order.id} className="flex flex-col gap-2 py-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{order.id}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-brand-gray-500">Placed on {order.placedAt}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brand-gray-500">
                          {order.items.map((i) => i.name).join(', ')}
                        </span>
                        <span className="font-semibold">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-lg uppercase tracking-wide">Saved Addresses</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {user.addresses.map((address) => (
                  <div key={address.id} className="flex flex-col gap-1 border border-brand-gray-200 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{address.label}</span>
                      {address.isDefault && <span className="text-xs text-brand-red-700">Default</span>}
                    </div>
                    <p className="text-brand-gray-500">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ''}
                    </p>
                    <p className="text-brand-gray-500">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-brand-gray-500">{address.country}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
