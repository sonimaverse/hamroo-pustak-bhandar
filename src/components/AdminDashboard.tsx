import { LogOut, TrendingUp, Package, Users, Warehouse } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

const stats = [
  { label: "Today's Sales", value: 'Rs. 24,650', icon: TrendingUp },
  { label: 'Orders Pending', value: '12', icon: Package },
  { label: 'Active Dealers', value: '38', icon: Users },
  { label: 'Low Stock Items', value: '7', icon: Warehouse },
];

const wholesalePricing = [
  { title: 'SEE Mathematics', retail: 500, wholesale: 380 },
  { title: 'SEE Physics Guide', retail: 550, wholesale: 410 },
  { title: 'The Alchemist', retail: 450, wholesale: 330 },
  { title: 'Rich Dad Poor Dad', retail: 600, wholesale: 460 },
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-cream-50">
      <header className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
        <div>
          <p className="font-serif text-lg font-bold">Hamro Pustak Bhandar</p>
          <p className="text-xs text-cream-100/70">Admin Portal</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
        >
          <LogOut size={16} />
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 rounded-lg border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-brown-700">
          Sample data shown for demonstration. Connect this dashboard to your real orders,
          inventory and dealer records once your backend is wired up.
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-white p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-navy-700">
                <Icon size={18} />
              </span>
              <p className="mt-3 text-2xl font-bold text-brown-800">{value}</p>
              <p className="text-xs text-brown-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-serif text-lg font-bold text-brown-800">
            Wholesale vs. Retail Pricing
          </h2>
          <p className="mb-4 text-sm text-brown-400">
            Admin-only pricing data &mdash; never exposed on the customer-facing site.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brown-100 text-brown-500">
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Retail Price</th>
                  <th className="py-2 pr-4 font-medium">Wholesale Price</th>
                  <th className="py-2 font-medium">Margin</th>
                </tr>
              </thead>
              <tbody>
                {wholesalePricing.map((row) => (
                  <tr key={row.title} className="border-b border-brown-50">
                    <td className="py-2.5 pr-4 text-brown-800">{row.title}</td>
                    <td className="py-2.5 pr-4">Rs. {row.retail}</td>
                    <td className="py-2.5 pr-4">Rs. {row.wholesale}</td>
                    <td className="py-2.5 text-emerald-700">Rs. {row.retail - row.wholesale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
