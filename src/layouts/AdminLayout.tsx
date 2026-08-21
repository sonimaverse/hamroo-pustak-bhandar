import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ShieldCheck,
  BookOpen,
  FolderTree,
  Briefcase,
  ShoppingBag,
  Users,
  ArrowLeft,
  LogOut,
  HelpCircle,
  FileText,
  Receipt,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [{ path: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Operations',
    items: [{ path: '/admin/orders', label: 'Orders', icon: ShoppingBag }],
  },
  {
    title: 'Catalog',
    items: [
      { path: '/admin/books', label: 'Books', icon: BookOpen },
      { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    ],
  },
  {
    title: 'Customers',
    items: [{ path: '/admin/users', label: 'Users', icon: Users }],
  },
  {
    title: 'Wholesale',
    items: [{ path: '/admin/wholesale', label: 'Applications', icon: Briefcase }],
  },
  {
    title: 'Billing',
    items: [
      { path: '/admin/billing', label: 'Invoices', icon: Receipt },
      { path: '/admin/quotations', label: 'Quotations', icon: FileText },
      { path: '/admin/enquiries', label: 'Enquiries', icon: HelpCircle },
    ],
  },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(['Catalog', 'Billing'])
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex selection:bg-purple-700 selection:text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200
          transform transition-transform duration-200 ease-in-out
          flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="lg:hidden flex justify-end p-3">
          <button
            onClick={closeSidebar}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-5 h-16 border-b border-stone-200 shrink-0">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <span className="font-serif font-bold text-sm text-stone-900">
            Hamro Pustak <span className="text-purple-600">Admin</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {SECTIONS.map((section) => {
            const isOpen = openSections.has(section.title);
            const hasMultiple = section.items.length > 1;

            return (
              <div key={section.title}>
                {hasMultiple ? (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between w-full px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-600 transition rounded-lg"
                  >
                    <span>{section.title}</span>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : (
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {section.title}
                  </div>
                )}

                {(!hasMultiple || isOpen) && (
                  <div className={`space-y-0.5 ${hasMultiple ? 'mt-1' : 'mt-0.5'}`}>
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition
                          ${
                            isActive
                              ? 'bg-purple-700 text-white shadow-sm'
                              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-stone-900 text-white sticky top-0 z-30">
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Storefront
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
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
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>

        <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-200 bg-white">
          Hamro Pustak Bhandar Management Console • Secure API Integration Active
        </footer>
      </div>
    </div>
  );
};
