import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingBag, Building2, ShieldCheck } from 'lucide-react';

export const WholesaleNav: React.FC = () => {
  const navItems = [
    { label: 'Overview', path: '/wholesale/dashboard', icon: LayoutDashboard },
    { label: 'Bulk Catalog', path: '/wholesale/books', icon: BookOpen },
    { label: 'Supply Orders', path: '/wholesale/orders', icon: ShoppingBag },
    { label: 'Business Profile', path: '/wholesale/profile', icon: Building2 },
    { label: 'Status & Verification', path: '/wholesale/status', icon: ShieldCheck },
  ];

  return (
    <div className="bg-amber-950/90 text-amber-100 rounded-2xl p-1.5 shadow-sm border border-amber-900/50 mb-6 flex items-center gap-1 overflow-x-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/wholesale/dashboard'}
          className={({ isActive }) =>
            `px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              isActive
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-amber-200/80 hover:text-white hover:bg-amber-900/50'
            }`
          }
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
