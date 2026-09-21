import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shirt,
  FolderTree,
  ShoppingCart,
  UserCircle,
  Boxes,
  TicketPercent,
  Star,
  Image,
  Bell,
  BarChart3,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { ADMIN_ROUTES } from '@/constants/routes';
import { Logo } from '@/components/common';
import { cn } from '@/utils';

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD, icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Products', path: ADMIN_ROUTES.PRODUCTS, icon: Shirt },
      { label: 'Categories', path: ADMIN_ROUTES.CATEGORIES, icon: FolderTree },
      { label: 'Inventory', path: ADMIN_ROUTES.INVENTORY, icon: Boxes },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Orders', path: ADMIN_ROUTES.ORDERS, icon: ShoppingCart },
      { label: 'Coupons', path: ADMIN_ROUTES.COUPONS, icon: TicketPercent },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Users', path: ADMIN_ROUTES.USERS, icon: Users },
      { label: 'Customers', path: ADMIN_ROUTES.CUSTOMERS, icon: UserCircle },
      { label: 'Reviews', path: ADMIN_ROUTES.REVIEWS, icon: Star },
    ],
  },
  {
    label: 'Content',
    items: [{ label: 'Banners', path: ADMIN_ROUTES.BANNERS, icon: Image }],
  },
  {
    label: 'System',
    items: [
      { label: 'Notifications', path: ADMIN_ROUTES.NOTIFICATIONS, icon: Bell },
      { label: 'Reports', path: ADMIN_ROUTES.REPORTS, icon: BarChart3 },
      { label: 'Roles & Permissions', path: ADMIN_ROUTES.ROLES, icon: ShieldCheck },
      { label: 'Settings', path: ADMIN_ROUTES.SETTINGS, icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
}

export function AdminSidebar({ collapsed }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex h-full flex-col overflow-y-auto bg-brand-black text-brand-white transition-all duration-200',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        {collapsed ? (
          <span className="font-display text-lg tracking-wide">DL</span>
        ) : (
          <Logo className="text-brand-white" />
        )}
      </div>

      <nav className="flex-1 px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">{group.label}</p>
            )}
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-brand-red-700 text-brand-white' : 'text-white/70 hover:bg-white/10 hover:text-brand-white',
                    )
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
