export const ROUTES = {
  HOME: '/',
  TSHIRTS: '/t-shirts',
  PRODUCT_DETAILS: '/t-shirts/:slug',
  ABOUT: '/about-us',
  CONTACT: '/contact-us',
  CART: '/cart',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/my-profile',
  NOT_FOUND: '*',
} as const;

export const productDetailsPath = (slug: string) => `/t-shirts/${slug}`;

export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin',
  USERS: '/admin/users',
  PRODUCTS: '/admin/products',
  CATEGORIES: '/admin/categories',
  ORDERS: '/admin/orders',
  ORDER_DETAILS: '/admin/orders/:id',
  CUSTOMERS: '/admin/customers',
  CUSTOMER_DETAILS: '/admin/customers/:id',
  INVENTORY: '/admin/inventory',
  COUPONS: '/admin/coupons',
  REVIEWS: '/admin/reviews',
  BANNERS: '/admin/banners',
  CMS_PAGES: '/admin/cms/pages',
  CMS_BLOGS: '/admin/cms/blogs',
  NOTIFICATIONS: '/admin/notifications',
  REPORTS: '/admin/reports',
  ROLES: '/admin/roles',
  SETTINGS: '/admin/settings',
} as const;

export const adminOrderDetailsPath = (id: string) => `/admin/orders/${id}`;
export const adminCustomerDetailsPath = (id: string) => `/admin/customers/${id}`;
