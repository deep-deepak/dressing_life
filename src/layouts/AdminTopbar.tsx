import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, UserCircle } from 'lucide-react';
import { ADMIN_ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store';
import { useAsync, useDisclosure } from '@/hooks';
import { getNotifications } from '@/services';
import { cn } from '@/utils';

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: notifications } = useAsync(() => getNotifications(), []);
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  const profileMenu = useDisclosure();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) profileMenu.close();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenu]);

  const handleLogout = () => {
    logout();
    navigate(ADMIN_ROUTES.LOGIN);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-brand-gray-200 bg-brand-white px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="text-brand-gray-600 hover:text-brand-black"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => navigate(ADMIN_ROUTES.NOTIFICATIONS)}
          className="relative text-brand-gray-600 hover:text-brand-black"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-brand-red-700 text-[10px] font-semibold text-brand-white">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button type="button" onClick={profileMenu.toggle} className="flex items-center gap-2">
            <UserCircle size={26} className="text-brand-gray-600" />
            <span className="hidden text-sm font-medium sm:inline">{user?.firstName ?? 'Admin'}</span>
          </button>
          <div
            className={cn(
              'absolute right-0 z-10 mt-3 w-44 border border-brand-gray-200 bg-brand-white py-1 shadow-lg',
              !profileMenu.isOpen && 'hidden',
            )}
          >
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-brand-black hover:bg-brand-gray-100"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
