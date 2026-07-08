import type { AdminUser } from '@/types';
import { placeholderImage } from '@/utils';

const avatar = (label: string) => placeholderImage({ label, width: 200, height: 200, background: '1a1a1a' });

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'au-001',
    name: 'Martin Sequeira',
    email: 'admin@dressinglife.com',
    role: 'admin',
    status: 'active',
    avatarUrl: avatar('MS'),
    lastLogin: '2026-07-08',
    createdAt: '2025-11-02',
  },
  {
    id: 'au-002',
    name: 'Farah Nadeem',
    email: 'farah.nadeem@dressinglife.com',
    role: 'manager',
    status: 'active',
    avatarUrl: avatar('FN'),
    lastLogin: '2026-07-07',
    createdAt: '2025-12-14',
  },
  {
    id: 'au-003',
    name: 'Devansh Oberoi',
    email: 'devansh.oberoi@dressinglife.com',
    role: 'manager',
    status: 'active',
    avatarUrl: avatar('DO'),
    lastLogin: '2026-07-05',
    createdAt: '2026-01-09',
  },
  {
    id: 'au-004',
    name: 'Ishita Bhalla',
    email: 'ishita.bhalla@dressinglife.com',
    role: 'support',
    status: 'active',
    avatarUrl: avatar('IB'),
    lastLogin: '2026-07-06',
    createdAt: '2026-02-20',
  },
  {
    id: 'au-005',
    name: 'Sameer Chadha',
    email: 'sameer.chadha@dressinglife.com',
    role: 'support',
    status: 'inactive',
    avatarUrl: avatar('SC'),
    lastLogin: '2026-05-11',
    createdAt: '2026-02-27',
  },
];
