import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { BookOpen, FolderTree, Briefcase, ShoppingBag, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [bookCount, setBookCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [wholesaleAppCount, setWholesaleAppCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [booksData, catsData, wsData, ordersData] = await Promise.allSettled([
          bookService.getBooks({ limit: 1 }),
          categoryService.getCategories(),
          adminService.getWholesaleApplications(),
          adminService.getOrders({ limit: 1 }),
        ]);

        if (booksData.status === 'fulfilled') setBookCount(booksData.value.pagination.totalBooks);
        if (catsData.status === 'fulfilled') setCategoryCount(catsData.value.categories.length);
        if (wsData.status === 'fulfilled') setWholesaleAppCount(wsData.value.applications.length);
        if (ordersData.status === 'fulfilled') setOrderCount(ordersData.value.pagination?.totalOrders || ordersData.value.orders.length);
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading admin control panel..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Admin Overview & Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage books, categories, B2B wholesale applications, and customer orders.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Books</span>
            <BookOpen className="w-4 h-4 text-red-700" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{bookCount}</p>
          <Link to="/admin/books" className="text-[11px] font-bold text-red-700 hover:underline inline-flex items-center gap-1 pt-1">
            Manage Books <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
            <FolderTree className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{categoryCount}</p>
          <Link to="/admin/categories" className="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 pt-1">
            Manage Categories <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Wholesale Apps</span>
            <Briefcase className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{wholesaleAppCount}</p>
          <Link to="/admin/wholesale" className="text-[11px] font-bold text-amber-700 hover:underline inline-flex items-center gap-1 pt-1">
            Review Applications <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-purple-700" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{orderCount}</p>
          <Link to="/admin/orders" className="text-[11px] font-bold text-purple-700 hover:underline inline-flex items-center gap-1 pt-1">
            Manage Orders <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>

      {/* Direct Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-3">
          <h3 className="font-serif font-bold text-stone-900 text-base">Quick Catalog Actions</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Add new publication titles, update regular & wholesale prices, adjust stock inventory, or create categories.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              to="/admin/books"
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-2xs transition"
            >
              + Add New Book
            </Link>
            <Link
              to="/admin/categories"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition"
            >
              Manage Categories
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-3">
          <h3 className="font-serif font-bold text-stone-900 text-base">Order & Partner Verification</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Verify pending wholesale applications from Nepalese bookstores or update delivery & payment statuses for placed orders.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              to="/admin/wholesale"
              className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold shadow-2xs transition"
            >
              Wholesale Applications
            </Link>
            <Link
              to="/admin/orders"
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-2xs transition"
            >
              Order Console
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
