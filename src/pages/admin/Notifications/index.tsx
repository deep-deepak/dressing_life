import { useState } from 'react';
import type { ComponentType } from 'react';
import { Bell, Boxes, CheckCheck, ShoppingBag, Star } from 'lucide-react';
import type { AdminNotification, NotificationType } from '@/types';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/services';
import { useAsync, usePagination } from '@/hooks';
import { Button, EmptyState, Pagination, Spinner } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { cn } from '@/utils';

const TYPE_ICON: Record<NotificationType, ComponentType<{ size?: number; className?: string }>> = {
  order: ShoppingBag,
  inventory: Boxes,
  review: Star,
  system: Bell,
};

export default function AdminNotificationsPage() {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: notifications, isLoading, error } = useAsync(() => getNotifications(), [reloadKey]);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const { page, setPage, totalPages, paginated } = usePagination(notifications ?? [], 10);

  const handleMarkAsRead = async (notification: AdminNotification) => {
    if (notification.isRead) return;
    await markNotificationAsRead(notification.id);
    setReloadKey((k) => k + 1);
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    await markAllNotificationsAsRead();
    setIsMarkingAll(false);
    setReloadKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Stay on top of orders, inventory, reviews, and system alerts."
        action={
          <Button variant="ghost" icon={<CheckCheck size={16} />} onClick={handleMarkAllAsRead} isLoading={isMarkingAll}>
            Mark all as read
          </Button>
        }
      />

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center border border-brand-gray-200 bg-brand-white">
          <Spinner />
        </div>
      ) : paginated.length === 0 ? (
        <div className="border border-brand-gray-200 bg-brand-white">
          <EmptyState title="No notifications" description="You're all caught up." />
        </div>
      ) : (
        <div className="flex flex-col border border-brand-gray-200 bg-brand-white">
          {paginated.map((notification) => {
            const Icon = TYPE_ICON[notification.type];
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleMarkAsRead(notification)}
                className={cn(
                  'flex items-start gap-4 border-b border-brand-gray-100 px-4 py-4 text-left last:border-0 hover:bg-brand-gray-50',
                  !notification.isRead && 'bg-brand-gray-50/60',
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center border border-brand-gray-200 bg-brand-white text-brand-black">
                  <Icon size={16} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm', !notification.isRead ? 'font-semibold text-brand-black' : 'font-medium text-brand-gray-700')}>
                      {notification.title}
                    </span>
                    {!notification.isRead && <span className="size-2 shrink-0 rounded-full bg-brand-red-700" aria-label="Unread" />}
                  </div>
                  <p className="mt-1 text-sm text-brand-gray-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-brand-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
