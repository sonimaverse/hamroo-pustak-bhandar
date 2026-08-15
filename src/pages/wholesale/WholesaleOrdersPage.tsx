import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/order';
import { useCart } from '../../contexts/CartContext';
import { WholesaleNav } from '../../components/wholesale/WholesaleNav';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { ShoppingBag, RefreshCw, CheckCircle, Package, ArrowRight, Clock, MapPin, CreditCard } from 'lucide-react';

export const WholesaleOrdersPage: React.FC = () => {
  const { addToCart } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'wholesale'>('wholesale');
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Wholesale Supply Orders | Hamro Pustak Bhandar';
    fetchOrders();
  }, []);

  const handleReorder = async (order: Order) => {
    try {
      setReorderingId(order._id);
      setReorderSuccess(null);
      for (const item of order.items) {
        await addToCart(item.bookId, item.quantity);
      }
      setReorderSuccess(`Successfully added ${order.items.length} titles from Order #${order._id.slice(-6)} to your cart.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reorder items.');
    } finally {
      setReorderingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterType === 'wholesale') return order.orderType === 'wholesale';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      <WholesaleNav />

      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <ShoppingBag className="w-4 h-4" />
            <span>Order Records & Reorder</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Wholesale Trade Orders
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Review past supply shipments and reorder stock items directly into your cart.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 self-start md:self-auto">
          <button
            onClick={() => setFilterType('wholesale')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'wholesale' ? 'bg-amber-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Wholesale Only
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'all' ? 'bg-amber-900 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Orders
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {reorderSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{reorderSuccess}</span>
          </div>
          <Link to="/cart" className="underline hover:text-emerald-950">
            Go to Cart & Checkout &rarr;
          </Link>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <LoadingSpinner label="Fetching order records..." />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-stone-300 mx-auto stroke-1" />
          <h3 className="font-serif font-bold text-stone-800">No Orders Found</h3>
          <p className="text-xs text-stone-500">You have no recorded orders in this view.</p>
          <Link
            to="/wholesale/books"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4"
            >
              
              {/* Top Order Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-stone-900 text-sm">Order #{order._id}</span>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full uppercase">
                      {order.orderType}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-50 text-amber-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReorder(order)}
                    disabled={reorderingId === order._id}
                    className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${reorderingId === order._id ? 'animate-spin' : ''}`} />
                    <span>Reorder Supply</span>
                  </button>

                  <Link
                    to={`/orders/${order._id}`}
                    className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-bold transition"
                  >
                    View Invoice
                  </Link>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Order Items ({order.items.length})</div>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 divide-y divide-stone-200/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div className="font-medium text-stone-900">
                        {item.title} <span className="text-stone-400 font-mono">x{item.quantity}</span>
                      </div>
                      <div className="font-bold text-stone-900 font-mono">
                        Rs. {item.subtotal.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs">
                <div className="text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Ship To: {order.shippingAddress?.municipality}, {order.shippingAddress?.district}, {order.shippingAddress?.province}</span>
                </div>

                <div className="font-serif text-sm font-bold text-stone-900">
                  Total Paid: <span className="text-amber-900">Rs. {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
