import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout, AuthLayout, AdminLayout } from '@/layouts';
import { ROUTES, ADMIN_ROUTES } from '@/constants/routes';
import { RequireAdminAuth } from './RequireAdminAuth';
import { RequireAuth } from './RequireAuth';
import HomePage from '@/pages/Home';
import TShirtsPage from '@/pages/TShirts';
import ProductDetailsPage from '@/pages/ProductDetails';
import AboutUsPage from '@/pages/AboutUs';
import ContactUsPage from '@/pages/ContactUs';
import CartPage from '@/pages/Cart';
import WishlistPage from '@/pages/Wishlist';
import CheckoutPage from '@/pages/Checkout';
import OrderConfirmationPage from '@/pages/OrderConfirmation';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import MyProfilePage from '@/pages/MyProfile';
import NotFoundPage from '@/pages/NotFound';
import AdminLoginPage from '@/pages/admin/Login';
import AdminDashboardPage from '@/pages/admin/Dashboard';
import AdminProductsPage from '@/pages/admin/Products';
import AdminOrdersPage from '@/pages/admin/Orders';
import AdminUsersPage from '@/pages/admin/Users';
import AdminCategoriesPage from '@/pages/admin/Categories';
import AdminCustomersPage from '@/pages/admin/Customers';
import AdminInventoryPage from '@/pages/admin/Inventory';
import AdminCouponsPage from '@/pages/admin/Coupons';
import AdminReviewsPage from '@/pages/admin/Reviews';
import AdminBannersPage from '@/pages/admin/Banners';
import AdminCmsPagesPage from '@/pages/admin/Cms/Pages';
import AdminCmsBlogsPage from '@/pages/admin/Cms/Blogs';
import AdminNotificationsPage from '@/pages/admin/Notifications';
import AdminReportsPage from '@/pages/admin/Reports';
import AdminRolesPage from '@/pages/admin/Roles';
import AdminSettingsPage from '@/pages/admin/Settings';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.TSHIRTS, element: <TShirtsPage /> },
      { path: ROUTES.PRODUCT_DETAILS, element: <ProductDetailsPage /> },
      { path: ROUTES.ABOUT, element: <AboutUsPage /> },
      { path: ROUTES.CONTACT, element: <ContactUsPage /> },
      { path: ROUTES.CART, element: <CartPage /> },
      { path: ROUTES.WISHLIST, element: <WishlistPage /> },
      {
        path: ROUTES.CHECKOUT,
        element: (
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.ORDER_CONFIRMATION,
        element: (
          <RequireAuth>
            <OrderConfirmationPage />
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <RequireAuth>
            <MyProfilePage />
          </RequireAuth>
        ),
      },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },
  { path: ADMIN_ROUTES.LOGIN, element: <AdminLoginPage /> },
  {
    element: (
      <RequireAdminAuth>
        <AdminLayout />
      </RequireAdminAuth>
    ),
    children: [
      { path: ADMIN_ROUTES.DASHBOARD, element: <AdminDashboardPage /> },
      { path: ADMIN_ROUTES.PRODUCTS, element: <AdminProductsPage /> },
      { path: ADMIN_ROUTES.CATEGORIES, element: <AdminCategoriesPage /> },
      { path: ADMIN_ROUTES.ORDERS, element: <AdminOrdersPage /> },
      { path: ADMIN_ROUTES.CUSTOMERS, element: <AdminCustomersPage /> },
      { path: ADMIN_ROUTES.INVENTORY, element: <AdminInventoryPage /> },
      { path: ADMIN_ROUTES.COUPONS, element: <AdminCouponsPage /> },
      { path: ADMIN_ROUTES.USERS, element: <AdminUsersPage /> },
      { path: ADMIN_ROUTES.REVIEWS, element: <AdminReviewsPage /> },
      { path: ADMIN_ROUTES.BANNERS, element: <AdminBannersPage /> },
      { path: ADMIN_ROUTES.CMS_PAGES, element: <AdminCmsPagesPage /> },
      { path: ADMIN_ROUTES.CMS_BLOGS, element: <AdminCmsBlogsPage /> },
      { path: ADMIN_ROUTES.NOTIFICATIONS, element: <AdminNotificationsPage /> },
      { path: ADMIN_ROUTES.REPORTS, element: <AdminReportsPage /> },
      { path: ADMIN_ROUTES.ROLES, element: <AdminRolesPage /> },
      { path: ADMIN_ROUTES.SETTINGS, element: <AdminSettingsPage /> },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
