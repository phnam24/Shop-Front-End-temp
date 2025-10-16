import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../shared/components/layout/MainLayout';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProfilePage from '../pages/ProfilePage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import WishlistPage from '../pages/WishlistPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'products/:slug',
        element: <ProductDetailPage />,
      },
      {
        path: 'laptops',
        element: <ProductsPage />,
      },
      {
        path: 'smartphones',
        element: <ProductsPage />,
      },
      // Cart
      {
        path: 'cart',
        element: <CartPage />,
      },
      // Wishlist
      {
        path: 'wishlist',
        element: <WishlistPage />,
      },
      // Checkout (Protected)
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      // Orders (Protected)
      {
        path: 'orders/:orderId/success',
        element: (
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:orderId',
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      // Profile (Protected)
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Auth routes
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/register',
    element: <AuthPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
]);