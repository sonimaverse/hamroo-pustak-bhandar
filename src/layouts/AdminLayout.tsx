import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, BookOpen, FolderTree, Briefcase, ShoppingBag, Users, ArrowLeft, LogOut, HelpCircle, FileText } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: ShieldCheck },
    { label: 'Books', path: '/admin/books', icon: BookOpen },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Wholesale Apps', path: '/admin/wholesale', icon: Briefcase },
    { label: 'Enquiries', path: '/admin/enquiries', icon: HelpCircle },
    { label: 'Quotations', path: '/admin/quotations', icon: FileText },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-purple-700 selection:text-white">
      
      {/* Top Admin Navbar */}
      <header className="bg-stone-900 text-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-stone-400 hover:text-white transition flex items-center gap-1 text-xs font-bold">
              <ArrowLeft className="w-4 h-4" /> Storefront
            </Link>
            <div className="h-4 w-px bg-stone-700" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span className="font-serif font-bold text-base tracking-tight">
                Hamro Pustak <span className="text-purple-400">Admin</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold">{user?.name}</span>
              <span className="block text-[10px] text-purple-300 font-mono">Administrator</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Secondary Navigation Tabs */}
        <div className="bg-stone-800/80 backdrop-blur-xs border-t border-stone-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                  }`
                }
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-200 bg-white">
        Hamro Pustak Bhandar Management Console • Secure API Integration Active
      </footer>

    </div>
  );
};
