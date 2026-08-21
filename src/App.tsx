import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { AdminRoute } from './components/routes/AdminRoute';
import { WholesaleRoute } from './components/routes/WholesaleRoute';

// Public pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

// Customer pages
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';

// Wholesale pages
import { WholesaleApplyPage } from './pages/wholesale/WholesaleApplyPage';
import { WholesaleStatusPage } from './pages/wholesale/WholesaleStatusPage';
import { WholesaleDashboardPage } from './pages/wholesale/WholesaleDashboardPage';
import { WholesaleBooksPage } from './pages/wholesale/WholesaleBooksPage';
import { WholesaleOrdersPage } from './pages/wholesale/WholesaleOrdersPage';
import { WholesaleProfilePage } from './pages/wholesale/WholesaleProfilePage';

// Admin pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBooksPage } from './pages/admin/AdminBooksPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminWholesalePage } from './pages/admin/AdminWholesalePage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminQuotationsPage } from './pages/admin/AdminQuotationsPage';
import { AdminBillingPage } from './pages/admin/AdminBillingPage';
import { InvoiceViewPage } from './pages/admin/InvoiceViewPage';

// Other pages
import { EnquiryPage } from './pages/EnquiryPage';

/**
 * Detect the correct basename.
 *
 * Local development:
 *   http://localhost:3000/
 *
 * GitHub Pages:
 *   https://username.github.io/hamroo-pustak-bhandar/
 */
const getBasename = () => {
  if (
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/hamroo-pustak-bhandar')
  ) {
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

            {/* =====================================================
                PUBLIC / CUSTOMER STORE ROUTES
            ====================================================== */}

            <Route path="/" element={<MainLayout />}>

              {/* ================= PUBLIC PAGES ================= */}

              <Route
                index
                element={<HomePage />}
              />

              <Route
                path="shop"
                element={<ShopPage />}
              />

              <Route
                path="books/:id"
                element={<BookDetailsPage />}
              />

              <Route
                path="cart"
                element={<CartPage />}
              />

              <Route
                path="enquiry"
                element={<EnquiryPage />}
              />

              {/* Wholesale application is public.
                  User can apply without being an approved wholesaler. */}
              <Route
                path="wholesale"
                element={<WholesaleApplyPage />}
              />

              {/* Authentication pages */}
              <Route
                path="login"
                element={<LoginPage />}
              />

              <Route
                path="register"
                element={<RegisterPage />}
              />

              <Route
                path="forgot-password"
                element={<ForgotPasswordPage />}
              />

              <Route
                path="reset-password"
                element={<ResetPasswordPage />}
              />


              {/* =================================================
                  GUEST CHECKOUT
                  
                  IMPORTANT:
                  Login/signup is NOT required here.
                  
                  Normal customers can:
                  Shop → Cart → Checkout → Place Order
                ================================================== */}

              <Route
                path="checkout"
                element={<CheckoutPage />}
              />

              {/* Guest order details are also public because
                   guest customers need to see their newly created order. */}
              <Route
                path="orders/:id"
                element={<OrderDetailsPage />}
              />

              {/* Invoice view is public (owner or admin).
                   Backend enforces ownership; guests without a token
                   see 403 on private invoices. */}
              <Route
                path="invoices/:id"
                element={<InvoiceViewPage />}
              />


              {/* =================================================
                  PROTECTED CUSTOMER ROUTES
                  
                  Login IS required for:
                  - Profile
                  - My Orders
                  - Wholesale Status
                ================================================== */}

              <Route element={<ProtectedRoute />}>

                <Route
                  path="profile"
                  element={<ProfilePage />}
                />

                <Route
                  path="orders"
                  element={<OrdersPage />}
                />

                <Route
                  path="wholesale/status"
                  element={<WholesaleStatusPage />}
                />

              </Route>


              {/* =================================================
                  WHOLESALE APPROVED PARTNER ROUTES
                  
                  These require authenticated + approved wholesale
                  account.
                ================================================== */}

              <Route element={<WholesaleRoute />}>

                <Route
                  path="wholesale/dashboard"
                  element={<WholesaleDashboardPage />}
                />

                <Route
                  path="wholesale/books"
                  element={<WholesaleBooksPage />}
                />

                <Route
                  path="wholesale/orders"
                  element={<WholesaleOrdersPage />}
                />

                <Route
                  path="wholesale/profile"
                  element={<WholesaleProfilePage />}
                />

              </Route>

            </Route>


            {/* =====================================================
                ADMIN LOGIN
                IMPORTANT:
                This route MUST NOT be inside AdminRoute.
            ====================================================== */}

            <Route
              path="/admin/login"
              element={<AdminLoginPage />}
            />


            {/* =====================================================
                PROTECTED ADMIN ROUTES
            ====================================================== */}

            <Route element={<AdminRoute />}>

              <Route
                path="/admin"
                element={<AdminLayout />}
              >

                <Route
                  index
                  element={<AdminDashboardPage />}
                />

                <Route
                  path="books"
                  element={<AdminBooksPage />}
                />

                <Route
                  path="categories"
                  element={<AdminCategoriesPage />}
                />

                <Route
                  path="wholesale"
                  element={<AdminWholesalePage />}
                />

                <Route
                  path="enquiries"
                  element={<AdminEnquiriesPage />}
                />

                <Route
                  path="quotations"
                  element={<AdminQuotationsPage />}
                />

                <Route
                  path="billing"
                  element={<AdminBillingPage />}
                />

                <Route
                  path="invoices/:id"
                  element={<InvoiceViewPage />}
                />

                <Route
                  path="orders"
                  element={<AdminOrdersPage />}
                />

                <Route
                  path="users"
                  element={<AdminUsersPage />}
                />

              </Route>

            </Route>


            {/* =====================================================
                FALLBACK
            ====================================================== */}

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;