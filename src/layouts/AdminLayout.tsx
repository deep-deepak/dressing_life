import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { cn } from '@/utils';

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <AdminSidebar collapsed={collapsed} onNavigate={() => setCollapsed(true)} />
      <div className={cn('flex min-h-screen flex-col transition-all duration-200', collapsed ? 'md:pl-[72px]' : 'md:pl-64')}>
        <AdminTopbar onToggleSidebar={() => setCollapsed((v) => !v)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
