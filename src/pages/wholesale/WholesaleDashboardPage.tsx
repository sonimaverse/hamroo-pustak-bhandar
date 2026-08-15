import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/order';
import { WholesaleNav } from '../../components/wholesale/WholesaleNav';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ShieldCheck, BookOpen, ShoppingBag, Building2, ArrowRight, RefreshCw, CheckCircle, Package } from 'lucide-react';

export const WholesaleDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Wholesale Partner Portal | Hamro Pustak Bhandar';
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load recent orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReorder = async (order: Order) => {
    try {
      setReorderingId(order._id);
      setReorderSuccess(null);
      for (const item of order.items) {
        await addToCart(item.bookId, item.quantity);
      }
      setReorderSuccess(`Successfully added ${order.items.length} items from Order #${order._id.slice(-6)} to your cart!`);
    } catch (err: any) {
      console.error('Failed to reorder:', err);
    } finally {
      setReorderingId(null);
    }
  };

  const totalWholesaleSpent = orders
    .filter((o) => o.orderType === 'wholesale')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      <WholesaleNav />

      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-900/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Wholesale Partner Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Hamro Pustak Bhandar B2B Hub
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/80 max-w-xl leading-relaxed">
            Welcome back, <strong className="text-amber-100">{user?.name}</strong>. Access discounted institutional catalog rates, bulk ordering tools, and trade order history.
          </p>
        </div>

        <Link
          to="/wholesale/books"
          className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span>Open Bulk Catalog</span>
        </Link>
      </div>

      {reorderSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{reorderSuccess}</span>
          </div>
          <Link to="/cart" className="underline hover:text-emerald-950">View Cart & Checkout &rarr;</Link>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-stone-400">Total Supply Orders</span>
          <div className="text-2xl font-serif font-bold text-stone-900">
            {orders.length} <span className="text-xs text-stone-400 font-sans font-normal">orders</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-stone-400">Wholesale Volume</span>
          <div className="text-2xl font-serif font-bold text-amber-900">
            Rs. {totalWholesaleSpent.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-stone-400">Partner Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-emerald-800 capitalize">{user?.wholesaleStatus || 'Approved'}</span>
          </div>
        </div>
      </div>

      {/* Grid Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-base">Bulk Book Catalog</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Order bulk quantities of educational, literary, and curriculum textbooks with server-verified wholesale discounts.
            </p>
          </div>
          <Link to="/wholesale/books" className="pt-3 text-xs font-bold text-amber-900 hover:underline inline-flex items-center gap-1">
            Browse Wholesale Books <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-base">Supply Orders & Reorder</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Track past institutional shipments, check status, and reorder previous book lists with 1-click cart loading.
            </p>
          </div>
          <Link to="/wholesale/orders" className="pt-3 text-xs font-bold text-amber-900 hover:underline inline-flex items-center gap-1">
            View Order History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-base">Business Profile</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Review company PAN / VAT number, registered business address, primary contact details, and license verification.
            </p>
          </div>
          <Link to="/wholesale/profile" className="pt-3 text-xs font-bold text-amber-900 hover:underline inline-flex items-center gap-1">
            Business Credentials <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Recent Wholesale Orders Table / List */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-900" />
            <h2 className="text-base font-serif font-bold text-stone-900">Recent Supply Orders</h2>
          </div>
          <Link to="/wholesale/orders" className="text-xs font-bold text-amber-900 hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading recent orders..." />
        ) : orders.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs text-stone-500">No previous wholesale orders found.</p>
            <Link
              to="/wholesale/books"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline"
            >
              Place Your First Order &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order._id}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-stone-900">Order #{order._id.slice(-6)}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full uppercase">
                      {order.orderType}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      • {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    {order.items.length} item(s) • Total: <strong className="text-stone-900">Rs. {order.totalAmount.toLocaleString()}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReorder(order)}
                    disabled={reorderingId === order._id}
                    className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${reorderingId === order._id ? 'animate-spin' : ''}`} />
                    <span>Reorder</span>
                  </button>

                  <Link
                    to={`/orders/${order._id}`}
                    className="px-3.5 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-bold transition"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
