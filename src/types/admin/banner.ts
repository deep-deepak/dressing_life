export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  position: 'homepage-hero' | 'homepage-promo' | 'category-top';
  order: number;
  status: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
}

export interface BannerPayload {
  title: string;
  imageUrl: string;
  link?: string;
  position: Banner['position'];
  order: number;
  status: Banner['status'];
  startDate?: string;
  endDate?: string;
}
