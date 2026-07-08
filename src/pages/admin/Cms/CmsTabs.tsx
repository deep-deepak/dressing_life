import { NavLink } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/constants/routes';
import { cn } from '@/utils';

const TABS = [
  { to: ADMIN_ROUTES.CMS_PAGES, label: 'Pages' },
  { to: ADMIN_ROUTES.CMS_BLOGS, label: 'Blogs' },
];

export function CmsTabs() {
  return (
    <div className="flex gap-6 border-b border-brand-gray-200">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              'border-b-2 pb-3 text-xs font-semibold uppercase tracking-wide transition-colors',
              isActive ? 'border-brand-black text-brand-black' : 'border-transparent text-brand-gray-500 hover:text-brand-black',
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
