import { useState } from 'react';
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
    <div className="min-h-screen bg-[#1a1209]">
      <header className="flex items-center justify-between bg-[#2d1a0a] px-6 py-4 text-white border-b border-gold-500/10">
        <div>
          <p className="font-serif text-lg font-bold text-gold-200">Hamro Pustak Bhandar</p>
          <p className="text-xs text-gold-400/60">Admin Portal</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-lg border border-gold-500/20 px-4 py-2 text-sm font-medium text-gold-300 transition hover:bg-gold-500/10"
        >
          <LogOut size={16} />
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 rounded-lg border border-gold-500/20 bg-gold-500/5 px-4 py-3 text-sm text-gold-300">
          Admin dashboard for managing inventory, pricing, orders, and payment integrations (eSewa/Khalti).
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-gold-500/10 bg-[#2d1a0a]/60 p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
                <Icon size={18} />
              </span>
              <p className="mt-3 text-2xl font-bold text-gold-200">{value}</p>
              <p className="text-xs text-gold-400/60">{label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-widest transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-brown-900 shadow-[0_0_20px_rgba(212,168,87,0.3)]'
                  : 'border border-gold-500/20 bg-gold-500/5 text-gold-300/70 hover:border-gold-500/40 hover:text-gold-200'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'inventory' && (
          <div className="rounded-xl border border-gold-500/10 bg-[#2d1a0a]/40 p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-gold-200">Inventory Management</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400/60" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full border border-gold-500/20 bg-[#1a1209]/60 pl-9 pr-4 py-2 text-sm text-gold-200 outline-none placeholder:text-gold-400/40 focus:border-gold-500/40"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gold-500/10 text-gold-400/60">
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
                    <tr key={item.id} className="border-b border-gold-500/5">
                      <td className="py-3 pr-4 text-gold-200">
                        {item.type === 'book' ? item.title : item.name}
                      </td>
                      <td className="py-3 pr-4 text-gold-400/60">
                        {item.type === 'book' ? item.category : 'Stationery'}
                      </td>
                      <td className="py-3 pr-4 text-gold-300">Rs. {item.retailPrice}</td>
                      <td className="py-3 pr-4 text-gold-300">Rs. {item.wholesalePrice}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`font-bold ${
                            (inventory[item.id] || 0) < 10
                              ? 'text-red-400'
                              : (inventory[item.id] || 0) < 30
                              ? 'text-yellow-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {inventory[item.id] || 0}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateStock(item.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold-500/20 text-gold-400 transition hover:bg-gold-500/10"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-gold-200 w-8 text-center">
                            {inventory[item.id] || 0}
                          </span>
                          <button
                            onClick={() => updateStock(item.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold-500/20 text-gold-400 transition hover:bg-gold-500/10"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="rounded-xl border border-gold-500/10 bg-[#2d1a0a]/40 p-6 shadow-soft">
            <h2 className="mb-4 font-serif text-lg font-bold text-gold-200">Wholesale vs. Retail Pricing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gold-500/10 text-gold-400/60">
                    <th className="py-2 pr-4 font-medium">Title</th>
                    <th className="py-2 pr-4 font-medium">Retail Price</th>
                    <th className="py-2 pr-4 font-medium">Wholesale Price</th>
                    <th className="py-2 font-medium">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {featuredBooks.map((row) => (
                    <tr key={row.id} className="border-b border-gold-500/5">
                      <td className="py-2.5 pr-4 text-gold-200">{row.title}</td>
                      <td className="py-2.5 pr-4 text-gold-300">Rs. {row.retailPrice}</td>
                      <td className="py-2.5 pr-4 text-gold-300">Rs. {row.wholesalePrice}</td>
                      <td className="py-2.5 text-emerald-400">Rs. {row.retailPrice - row.wholesalePrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="rounded-xl border border-gold-500/10 bg-[#2d1a0a]/40 p-6 shadow-soft">
            <h2 className="mb-4 font-serif text-lg font-bold text-gold-200">Recent Orders</h2>
            <div className="space-y-3">
              {[
                { id: 'ORD-001', customer: 'Kathmandu College', items: 5, total: 'Rs. 12,500', status: 'Pending' },
                { id: 'ORD-002', customer: 'St. Xavier School', items: 12, total: 'Rs. 8,400', status: 'Processing' },
                { id: 'ORD-003', customer: 'Bharatpur Office', items: 3, total: 'Rs. 3,200', status: 'Delivered' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-gold-500/10 bg-[#1a1209]/40 p-4">
                  <div>
                    <p className="text-sm font-bold text-gold-200">{order.id}</p>
                    <p className="text-xs text-gold-400/60">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gold-300">{order.total}</p>
                    <p className="text-xs text-gold-400/60">{order.items} items</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-600/20 text-emerald-400'
                        : order.status === 'Processing'
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : 'bg-gold-500/20 text-gold-400'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="rounded-xl border border-gold-500/10 bg-[#2d1a0a]/40 p-6 shadow-soft">
            <h2 className="mb-4 font-serif text-lg font-bold text-gold-200">Payment Integrations</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gold-500/10 bg-[#1a1209]/40 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-2xl font-bold text-purple-400">eSewa</span>
                  <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-bold text-emerald-400">Active</span>
                </div>
                <p className="text-sm text-gold-400/60">Digital wallet payment integration</p>
                <p className="mt-2 text-xs text-gold-400/40">Merchant ID: ************1234</p>
                <button className="mt-4 rounded-lg border border-gold-500/20 bg-gold-500/10 px-4 py-2 text-xs font-bold text-gold-300 transition hover:bg-gold-500/20">
                  Configure
                </button>
              </div>
              <div className="rounded-xl border border-gold-500/10 bg-[#1a1209]/40 p-6">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-400">Khalti</span>
                  <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-bold text-emerald-400">Active</span>
                </div>
                <p className="text-sm text-gold-400/60">Digital wallet payment integration</p>
                <p className="mt-2 text-xs text-gold-400/40">Merchant ID: ************5678</p>
                <button className="mt-4 rounded-lg border border-gold-500/20 bg-gold-500/10 px-4 py-2 text-xs font-bold text-gold-300 transition hover:bg-gold-500/20">
                  Configure
                </button>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-gold-500/10 bg-[#1a1209]/40 p-6">
              <h3 className="mb-2 text-sm font-bold text-gold-200">Payment Settings</h3>
              <p className="text-xs text-gold-400/60">Configure payment gateway credentials, callback URLs, and webhook settings for eSewa and Khalti integrations.</p>
              <div className="mt-4 flex gap-3">
                <button className="rounded-lg border border-gold-500/20 bg-gold-500/10 px-4 py-2 text-xs font-bold text-gold-300 transition hover:bg-gold-500/20">
                  eSewa Settings
                </button>
                <button className="rounded-lg border border-gold-500/20 bg-gold-500/10 px-4 py-2 text-xs font-bold text-gold-300 transition hover:bg-gold-500/20">
                  Khalti Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}