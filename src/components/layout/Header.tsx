import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  ShoppingCart,
  Menu,
  X,
  ShieldCheck,
  Briefcase,
  LogOut,
  Search,
  Phone,
  Mail,
  MapPin,
  Building2,
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import heroBrandImg from '../../assets/hero-brand.jpg';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }

    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }

    return false;
  };

  const navLinkClass = (path: string) =>
    `text-xs lg:text-sm font-semibold transition px-3 py-1.5 rounded-lg ${
      isActive(path)
        ? 'text-[#0F1E3D] bg-blue-50 font-bold border-b-2 border-[#0F1E3D]'
        : 'text-stone-700 hover:text-[#0F1E3D] hover:bg-stone-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-stone-200 w-full overflow-hidden">

      {/* =========================================================
          TOP INFORMATION BAR
      ========================================================= */}

      <div className="bg-[#0F1E3D] text-white text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 border-b border-blue-900">

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">

          {/* Contact Information */}
          <div className="flex items-center gap-3 text-stone-300 flex-wrap justify-center sm:justify-start">

            {/* Phone */}
            <a
              href="tel:+9779866115029"
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-amber-400" />

              <span>
                +977 9866115029
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:hamropustakbhandar7@gmail.com"
              className="hidden md:flex items-center gap-1 hover:text-white transition"
            >
              <Mail className="w-3 h-3 text-amber-400" />

              <span>
                hamropustakbhandar7@gmail.com
              </span>
            </a>

            {/* Location */}
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />

              <span>
                Bharatpur, Chitwan
              </span>
            </span>

          </div>

          {/* Right Top Links */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center text-center">

            <span className="text-amber-300 font-medium tracking-wide">
              सबैका लागि, सधैंका लागि
            </span>

            <span className="hidden sm:inline text-stone-500">
              |
            </span>

            {/* Institutional Enquiry */}
            <Link
              to="/enquiry"
              className="hover:text-amber-300 transition flex items-center gap-1 font-semibold text-amber-200"
            >
              <Building2 className="w-3 h-3" />

              <span>
                Institutional Enquiry
              </span>
            </Link>

            <span className="hidden sm:inline text-stone-500">
              |
            </span>

            {/* Wholesale */}
            <Link
              to="/wholesale"
              className="hover:text-amber-300 transition flex items-center gap-1 font-semibold text-amber-200"
            >
              <Briefcase className="w-3 h-3" />

              <span>
                Apply for Wholesale
              </span>
            </Link>

          </div>

        </div>

      </div>

      {/* =========================================================
          MAIN HEADER
      ========================================================= */}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-2 sm:gap-4">

          {/* =====================================================
              LOGO & BRAND
          ===================================================== */}

          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-3 group shrink min-w-0"
          >

            {/* Logo */}
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-amber-600 overflow-hidden shadow-sm bg-white shrink-0 flex items-center justify-center p-0.5">

              <img
                src={heroBrandImg}
                alt="Hamro Pustak Bhandar Seal"
                className="w-full h-full object-contain"
              />

            </div>

            {/* Brand Text */}
            <div className="min-w-0">

              <div className="flex items-baseline gap-1 flex-wrap">

                <span className="text-sm xs:text-base sm:text-2xl font-serif font-extrabold text-[#0F1E3D] tracking-tight leading-none italic">
                  Hamro
                </span>

                <span className="text-xs xs:text-sm sm:text-2xl font-serif font-black text-amber-800 tracking-tight leading-none uppercase">
                  PUSTAK BHANDAR
                </span>

              </div>

              <p className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider text-stone-600 mt-0.5 truncate hidden sm:block">
                Your Gateway To Knowledge • Your Trusted Book Store
              </p>

            </div>

          </Link>

          {/* =====================================================
              DESKTOP SEARCH
          ===================================================== */}

          <form
            onSubmit={handleHeaderSearch}
            className="hidden lg:flex items-center flex-1 max-w-md relative mx-4"
          >

            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, textbooks, stationery..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0F1E3D] transition"
            />

          </form>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <nav className="hidden md:flex items-center gap-1">

            {/* Home */}
            <Link
              to="/"
              className={navLinkClass('/')}
            >
              Home
            </Link>

            {/* Shop */}
            <Link
              to="/shop"
              className={navLinkClass('/shop')}
            >
              Shop Books
            </Link>

            {/* Enquiry */}
            <Link
              to="/enquiry"
              className={navLinkClass('/enquiry')}
            >
              Enquiry
            </Link>

            {/* Wholesale */}
            <Link
              to="/wholesale"
              className={navLinkClass('/wholesale')}
            >
              Wholesale
            </Link>

            {/* Admin */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`${navLinkClass('/admin')} flex items-center gap-1 text-purple-800 font-bold bg-purple-50`}
              >
                <ShieldCheck className="w-4 h-4" />

                Admin Portal
              </Link>
            )}

          </nav>

          {/* =====================================================
              RIGHT ACTIONS
          ===================================================== */}

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-stone-700 hover:text-[#0F1E3D] hover:bg-stone-100 rounded-xl transition flex items-center gap-1.5"
              title="Shopping Cart"
            >

              <ShoppingCart className="w-5 h-5" />

              <span className="hidden sm:inline text-xs font-bold text-[#0F1E3D]">
                Cart
              </span>

              {itemCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}

            </Link>

            {/* =================================================
                AUTHENTICATED USER
            ================================================= */}

            {isAuthenticated ? (

              <div className="flex items-center gap-2 border-l border-stone-200 pl-2 sm:pl-3">

                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 p-1 hover:bg-stone-100 rounded-xl transition"
                >

                  {/* Avatar */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0F1E3D] text-amber-300 font-bold flex items-center justify-center text-xs uppercase shadow-2xs">

                    {user?.name?.charAt(0) || 'U'}

                  </div>

                  {/* User Info */}
                  <div className="hidden xl:block text-left text-xs leading-tight">

                    <p className="font-bold text-stone-900 line-clamp-1">
                      {user?.name}
                    </p>

                    <p className="text-[10px] uppercase font-bold text-amber-700">
                      {user?.role}
                    </p>

                  </div>

                </Link>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="hidden sm:block p-2 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

              </div>

            ) : (

              /* =================================================
                 GUEST USER
              ================================================= */

              <div className="hidden sm:flex items-center gap-2 border-l border-stone-200 pl-3">

                {/* Login */}
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-stone-700 hover:text-[#0F1E3D] hover:bg-stone-100 rounded-xl transition"
                >
                  Sign In
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-[#0F1E3D] text-amber-300 hover:bg-blue-900 rounded-xl shadow-xs transition"
                >
                  Register
                </Link>

              </div>

            )}

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-stone-700 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle menu"
            >

              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}

            </button>

          </div>

        </div>

        {/* =======================================================
            MOBILE NAVIGATION DRAWER
        ======================================================= */}

        {mobileMenuOpen && (

          <div className="md:hidden py-4 border-t border-stone-200 space-y-3">

            {/* Mobile Search */}
            <form
              onSubmit={handleHeaderSearch}
              className="relative mb-3"
            >

              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, supplies..."
                className="w-full pl-9 pr-4 py-2 bg-stone-100 rounded-lg text-xs"
              />

            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-2">

              {/* Home */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/')}
              >
                Home
              </Link>

              {/* Shop */}
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/shop')}
              >
                Shop Books
              </Link>

              {/* Enquiry */}
              <Link
                to="/enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/enquiry')}
              >
                Institutional Enquiry
              </Link>

              {/* Wholesale */}
              <Link
                to="/wholesale"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/wholesale')}
              >
                Apply for Wholesale
              </Link>

              {/* Admin */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-purple-800 p-2 bg-purple-50 rounded-lg flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}

              {/* =================================================
                  MOBILE GUEST
              ================================================= */}

              {!isAuthenticated ? (

                <div className="pt-2 flex items-center gap-2 border-t border-stone-200">

                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-bold text-stone-700 bg-stone-100 rounded-xl"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-bold text-amber-300 bg-[#0F1E3D] rounded-xl"
                  >
                    Register
                  </Link>

                </div>

              ) : (

                /* =================================================
                   MOBILE AUTHENTICATED
                ================================================= */

                <div className="pt-2 flex items-center justify-between border-t border-stone-200 px-2">

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-[#0F1E3D]"
                  >
                    My Account ({user?.name})
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Sign Out
                  </button>

                </div>

              )}

              {/* Mobile Contact Info */}
              <div className="pt-3 mt-1 border-t border-stone-200 space-y-2">

                <a
                  href="tel:+9779866115029"
                  className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#0F1E3D]"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  +977 9866115029
                </a>

                <a
                  href="mailto:hamropustakbhandar7@gmail.com"
                  className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#0F1E3D]"
                >
                  <Mail className="w-4 h-4 text-amber-600" />
                  hamropustakbhandar7@gmail.com
                </a>

                <div className="flex items-start gap-2 text-xs font-semibold text-stone-600">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />

                  <span>
                    Near Om Shanti Academy,
                    <br />
                    Bharatpur, Chitwan
                  </span>
                </div>

              </div>

            </nav>

          </div>

        )}

      </div>

    </header>
  );
};