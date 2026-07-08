import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { cn } from '@/utils';

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <AdminSidebar collapsed={collapsed} />
      <div className={cn('flex min-h-screen flex-col transition-all duration-200', collapsed ? 'pl-[72px]' : 'pl-64')}>
        <AdminTopbar onToggleSidebar={() => setCollapsed((v) => !v)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
