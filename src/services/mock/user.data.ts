import type { User } from '@/types';

export const MOCK_USER: User = {
  id: 'u-001',
  firstName: 'Aditya',
  lastName: 'Sharma',
  email: 'aditya.sharma@example.com',
  phone: '+91 90000 12345',
  addresses: [
    {
      id: 'addr-001',
      label: 'Home',
      line1: '14, Sunrise Apartments',
      line2: 'MG Road',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411001',
      country: 'India',
      isDefault: true,
    },
  ],
  orders: [
    {
      id: 'ORD-10021',
      placedAt: '2026-06-18',
      status: 'delivered',
      items: [
        {
          productId: 'p-001',
          name: 'Onyx Graphic Tee',
          image: '',
          size: 'L',
          color: 'Black',
          quantity: 2,
          price: 1299,
        },
      ],
      total: 2598,
    },
    {
      id: 'ORD-10087',
      placedAt: '2026-07-02',
      status: 'shipped',
      items: [
        {
          productId: 'p-004',
          name: 'Urban Oversized Tee',
          image: '',
          size: 'M',
          color: 'Charcoal',
          quantity: 1,
          price: 1399,
        },
      ],
      total: 1399,
    },
  ],
};
