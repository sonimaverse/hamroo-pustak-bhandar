import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { AdminRoute } from './components/routes/AdminRoute';
import { WholesaleRoute } from './components/routes/WholesaleRoute';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';

import { WholesaleApplyPage } from './pages/wholesale/WholesaleApplyPage';
import { WholesaleStatusPage } from './pages/wholesale/WholesaleStatusPage';
import { WholesaleDashboardPage } from './pages/wholesale/WholesaleDashboardPage';
import { WholesaleBooksPage } from './pages/wholesale/WholesaleBooksPage';
import { WholesaleOrdersPage } from './pages/wholesale/WholesaleOrdersPage';
import { WholesaleProfilePage } from './pages/wholesale/WholesaleProfilePage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBooksPage } from './pages/admin/AdminBooksPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminWholesalePage } from './pages/admin/AdminWholesalePage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

import { EnquiryPage } from './pages/EnquiryPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminQuotationsPage } from './pages/admin/AdminQuotationsPage';

import { ApiInspectorPage } from './pages/dev/ApiInspectorPage';

const getBasename = () => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/hamroo-pustak-bhandar')) {
    return '/hamroo-pustak-bhandar';
  }
  return import.meta.env.BASE_URL || '/';
};

export function App() {
  return (
    <BrowserRouter basename={getBasename()}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            
            {/* Public and Main Store Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="books/:id" element={<BookDetailsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="enquiry" element={<EnquiryPage />} />
              <Route path="wholesale" element={<WholesaleApplyPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="dev/api-inspector" element={<ApiInspectorPage />} />

              {/* Protected Customer Account Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailsPage />} />
                <Route path="wholesale/status" element={<WholesaleStatusPage />} />
              </Route>

              {/* Wholesale Approved Partner Routes */}
              <Route element={<WholesaleRoute />}>
                <Route path="wholesale/dashboard" element={<WholesaleDashboardPage />} />
                <Route path="wholesale/books" element={<WholesaleBooksPage />} />
                <Route path="wholesale/orders" element={<WholesaleOrdersPage />} />
                <Route path="wholesale/profile" element={<WholesaleProfilePage />} />
              </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="books" element={<AdminBooksPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="wholesale" element={<AdminWholesalePage />} />
                <Route path="enquiries" element={<AdminEnquiriesPage />} />
                <Route path="quotations" element={<AdminQuotationsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
              </Route>
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
