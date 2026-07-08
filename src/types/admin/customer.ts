export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  status: 'active' | 'blocked';
}
