import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types/order';
import { orderService } from '../services/orderService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { Package, ArrowRight, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'My Orders | Hamro Pustak Bhandar';
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getMyOrders();
        setOrders(data.orders);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Fetching your orders history..." />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700">
            <Package className="w-4 h-4" />
            <span>Order History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            My Past Orders ({orders.length})
          </h1>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 stroke-1" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900">No Orders Found</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You haven't placed any book orders yet. Browse our shop to start building your library.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-red-800 transition"
            >
              <span>Explore Bookstore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord._id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4 hover:border-stone-300 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                <div>
                  <span className="font-bold text-stone-900 text-sm">
                    Order #{ord._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-stone-400 text-[11px] block sm:inline sm:ml-3">
                    Placed on {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase border ${getStatusBadge(ord.orderStatus)}`}>
                    Status: {ord.orderStatus}
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase border ${
                    ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    Payment: {ord.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-1.5 text-xs text-stone-700">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="font-medium text-stone-800">
                      • {it.title} <span className="text-stone-400 font-bold">x{it.quantity}</span>
                    </span>
                    <span className="font-mono font-semibold">Rs. {it.subtotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-stone-500">
                  <span className="font-semibold text-stone-700">Delivery Address:</span>{' '}
                  {ord.shippingAddress.municipality || ord.shippingAddress.city}, {ord.shippingAddress.district || ''}, {ord.shippingAddress.province || ord.shippingAddress.state}
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-serif font-bold text-stone-900 text-sm">
                    Total: <strong className="text-red-700">Rs. {ord.totalAmount.toLocaleString()}</strong>
                  </span>
                  <Link
                    to={`/orders/${ord._id}`}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
