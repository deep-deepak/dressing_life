export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
  productCount: number;
  status: 'active' | 'inactive';
}

export interface CategoryPayload {
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
  status: 'active' | 'inactive';
}
