import type { Permission, Role } from '@/types';

export const PERMISSIONS: Permission[] = [
  { key: 'dashboard.view', label: 'View dashboard', group: 'Dashboard' },
  { key: 'products.view', label: 'View products', group: 'Catalog' },
  { key: 'products.manage', label: 'Create / edit / delete products', group: 'Catalog' },
  { key: 'categories.manage', label: 'Manage categories', group: 'Catalog' },
  { key: 'inventory.manage', label: 'Adjust stock levels', group: 'Catalog' },
  { key: 'orders.view', label: 'View orders', group: 'Sales' },
  { key: 'orders.manage', label: 'Update order status', group: 'Sales' },
  { key: 'coupons.manage', label: 'Manage coupons', group: 'Sales' },
  { key: 'customers.view', label: 'View customers', group: 'People' },
  { key: 'users.manage', label: 'Manage admin users', group: 'People' },
  { key: 'reviews.moderate', label: 'Moderate reviews', group: 'People' },
  { key: 'banners.manage', label: 'Manage banners', group: 'Content' },
  { key: 'cms.manage', label: 'Manage pages & blogs', group: 'Content' },
  { key: 'reports.view', label: 'View reports & analytics', group: 'System' },
  { key: 'roles.manage', label: 'Manage roles & permissions', group: 'System' },
  { key: 'settings.manage', label: 'Manage store settings', group: 'System' },
];

export const ADMIN_ROLES: Role[] = [
  {
    id: 'rl-001',
    name: 'Admin',
    description: 'Full access to every module.',
    permissions: PERMISSIONS.map((p) => p.key),
    usersCount: 1,
  },
  {
    id: 'rl-002',
    name: 'Manager',
    description: 'Manages catalog, orders, and content, without user/role administration.',
    permissions: [
      'dashboard.view',
      'products.view',
      'products.manage',
      'categories.manage',
      'inventory.manage',
      'orders.view',
      'orders.manage',
      'coupons.manage',
      'customers.view',
      'reviews.moderate',
      'banners.manage',
      'cms.manage',
      'reports.view',
    ],
    usersCount: 2,
  },
  {
    id: 'rl-003',
    name: 'Support',
    description: 'Customer-facing operations: orders, customers, and reviews.',
    permissions: ['dashboard.view', 'orders.view', 'customers.view', 'reviews.moderate'],
    usersCount: 2,
  },
];
