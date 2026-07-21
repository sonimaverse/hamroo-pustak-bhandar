import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, TrendingUp, Package, Users, Warehouse, BookOpen, Search, Plus, Minus } from 'lucide-react';
import { featuredBooks, stationeryItems } from '../data/books';
import { Book } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'inventory' | 'pricing' | 'orders' | 'payments';

type InventoryItem = Book & { type: 'book' } | (typeof stationeryItems[0] & { type: 'stationery' });

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState<{ [key: string]: number }>(
    Object.fromEntries([...featuredBooks, ...stationeryItems].map((item) => [item.id, item.stock]))
  );

  const allItems: InventoryItem[] = [
    ...featuredBooks.map((b) => ({ ...b, type: 'book' as const })),
    ...stationeryItems.map((s) => ({ ...s, type: 'stationery' as const })),
  ];

  const filteredItems = allItems.filter((item) =>
    item.type === 'book'
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
      : item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStock = (id: string, delta: number) => {
    setInventory((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const stats = [
    { label: "Today's Sales", value: 'Rs. 24,650', icon: TrendingUp },
    { label: 'Orders Pending', value: '12', icon: Package },
    { label: 'Active Dealers', value: '38', icon: Users },
    { label: 'Low Stock Items', value: '7', icon: Warehouse },
  ];

  const tabs = [
    { id: 'inventory' as Tab, label: 'Inventory', icon: Package },
    { id: 'pricing' as Tab, label: 'Pricing', icon: BookOpen },
    { id: 'orders' as Tab, label: 'Orders', icon: Users },
    { id: 'payments' as Tab, label: 'Payments', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-ivory-50">
      <header className="flex items-center justify-between border-b border-coffee-100 bg-white px-6 py-4">
        <div>
          <p className="font-serif text-lg font-bold text-coffee-800">Hamro Pustak Bhandar</p>
          <p className="text-xs text-slate-500">Admin Portal</p>
        </div>
        <motion.button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl border border-coffee-200 px-4 py-2 text-sm font-medium text-coffee-700 transition hover:border-gold-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={16} />
          Log out
        </motion.button>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        <div className="mb-8 rounded-2xl border border-coffee-100 bg-white p-4 text-sm text-coffee-600 shadow-sm">
          Admin dashboard for managing inventory, pricing, orders, and payment integrations (eSewa/Khalti).
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <motion.div
              key={label}
              className="rounded-2xl border border-coffee-100 bg-white p-5 shadow-sm"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-200 bg-gold-50 text-gold-600">
                <Icon size={18} />
              </span>
              <p className="mt-3 text-2xl font-bold text-coffee-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-widest transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-coffee-700 text-ivory-50 shadow-md'
                  : 'border border-coffee-200 bg-white text-coffee-600 hover:border-gold-300 hover:text-coffee-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon size={14} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {activeTab === 'inventory' && (
          <motion.div
            className="rounded-2xl border border-coffee-100 bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-coffee-800">Inventory Management</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-coffee-200 bg-ivory-50 pl-9 pr-4 py-2 text-sm text-coffee-800 outline-none placeholder:text-slate-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-coffee-100 text-slate-500">
                    <th className="py-3 pr-4 font-medium">Item</th>
                    <th className="py-3 pr-4 font-medium">Category</th>
                    <th className="py-3 pr-4 font-medium">Retail Price</th>
                    <th className="py-3 pr-4 font-medium">Wholesale Price</th>
                    <th className="py-3 pr-4 font-medium">Stock</th>
                    <th className="py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-coffee-50">
                      <td className="py-3 pr-4 text-coffee-800">
                        {item.type === 'book' ? item.title : item.name}
                      </td>
                      <td className="py-3 pr-4 text-slate-500">
                        {item.type === 'book' ? item.category : 'Stationery'}
                      </td>
                      <td className="py-3 pr-4 text-coffee-700">Rs. {item.retailPrice}</td>
                      <td className="py-3 pr-4 text-coffee-700">Rs. {item.wholesalePrice}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`font-bold ${
                            (inventory[item.id] || 0) < 10
                              ? 'text-red-600'
                              : (inventory[item.id] || 0) < 30
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {inventory[item.id] || 0}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => updateStock(item.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 transition hover:bg-coffee-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus size={12} />
                          </motion.button>
                          <span className="text-xs font-bold text-coffee-800 w-8 text-center">
                            {inventory[item.id] || 0}
                          </span>
                          <motion.button
                            onClick={() => updateStock(item.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 transition hover:bg-coffee-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus size={12} />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div
            className="rounded-2xl border border-coffee-100 bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-4 font-serif text-lg font-bold text-coffee-800">Wholesale vs. Retail Pricing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-coffee-100 text-slate-500">
                    <th className="py-2 pr-4 font-medium">Title</th>
                    <th className="py-2 pr-4 font-medium">Retail Price</th>
                    <th className="py-2 pr-4 font-medium">Wholesale Price</th>
                    <th className="py-2 font-medium">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {featuredBooks.map((row) => (
                    <tr key={row.id} className="border-b border-coffee-50">
                      <td className="py-2.5 pr-4 text-coffee-800">{row.title}</td>
                      <td className="py-2.5 pr-4 text-coffee-700">Rs. {row.retailPrice}</td>
                      <td className="py-2.5 pr-4 text-coffee-700">Rs. {row.wholesalePrice}</td>
                      <td className="py-2.5 text-emerald-600">Rs. {row.retailPrice - row.wholesalePrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            className="rounded-2xl border border-coffee-100 bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-4 font-serif text-lg font-bold text-coffee-800">Recent Orders</h2>
            <div className="space-y-3">
              {[
                { id: 'ORD-001', customer: 'Kathmandu College', items: 5, total: 'Rs. 12,500', status: 'Pending' },
                { id: 'ORD-002', customer: 'St. Xavier School', items: 12, total: 'Rs. 8,400', status: 'Processing' },
                { id: 'ORD-003', customer: 'Bharatpur Office', items: 3, total: 'Rs. 3,200', status: 'Delivered' },
              ].map((order) => (
                <motion.div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-coffee-100 bg-ivory-50/80 p-4"
                  whileHover={{ y: -1 }}
                >
                  <div>
                    <p className="text-sm font-bold text-coffee-800">{order.id}</p>
                    <p className="text-xs text-slate-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-coffee-700">{order.total}</p>
                    <p className="text-xs text-slate-500">{order.items} items</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.status === 'Processing'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gold-100 text-gold-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'payments' && (
          <motion.div
            className="rounded-2xl border border-coffee-100 bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-4 font-serif text-lg font-bold text-coffee-800">Payment Integrations</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-coffee-100 bg-ivory-50/80 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-2xl font-bold text-purple-600">eSewa</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Active</span>
                </div>
                <p className="text-sm text-slate-500">Digital wallet payment integration</p>
                <p className="mt-2 text-xs text-slate-400">Merchant ID: ************1234</p>
                <motion.button
                  className="mt-4 rounded-xl border border-coffee-200 bg-white px-4 py-2 text-xs font-bold text-coffee-700 transition hover:border-gold-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Configure
                </motion.button>
              </div>
              <div className="rounded-2xl border border-coffee-100 bg-ivory-50/80 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600">Khalti</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Active</span>
                </div>
                <p className="text-sm text-slate-500">Digital wallet payment integration</p>
                <p className="mt-2 text-xs text-slate-400">Merchant ID: ************5678</p>
                <motion.button
                  className="mt-4 rounded-xl border border-coffee-200 bg-white px-4 py-2 text-xs font-bold text-coffee-700 transition hover:border-gold-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Configure
                </motion.button>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-coffee-100 bg-ivory-50/80 p-6">
              <h3 className="mb-2 text-sm font-bold text-coffee-800">Payment Settings</h3>
              <p className="text-xs text-slate-500">Configure payment gateway credentials, callback URLs, and webhook settings for eSewa and Khalti integrations.</p>
              <div className="mt-4 flex gap-3">
                <motion.button
                  className="rounded-xl border border-coffee-200 bg-white px-4 py-2 text-xs font-bold text-coffee-700 transition hover:border-gold-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  eSewa Settings
                </motion.button>
                <motion.button
                  className="rounded-xl border border-coffee-200 bg-white px-4 py-2 text-xs font-bold text-coffee-700 transition hover:border-gold-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Khalti Settings
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
