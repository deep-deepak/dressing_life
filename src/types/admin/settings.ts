export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  taxRatePct: number;
  flatShippingFee: number;
  freeShippingThreshold: number;
  logoUrl: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}
