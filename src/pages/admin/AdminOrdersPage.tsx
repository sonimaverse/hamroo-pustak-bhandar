import React, { useEffect, useState } from 'react';
import { Order } from '../../types/order';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { ShoppingBag, RefreshCw, Eye, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getOrders({
        orderStatus: statusFilter || undefined,
      });
      setOrders(Array.isArray(data?.orders) ? data.orders : (Array.isArray(data) ? data : []));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customer orders.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusUpdate = async (id: string, updates: { orderStatus?: string; paymentStatus?: string }) => {
    try {
      await adminService.updateOrderStatus(id, updates);
      fetchOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
            <ShoppingBag className="w-4 h-4" />
            <span>Fulfilment & Dispatch</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Store Orders Console ({orders.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
          >
            <option value="">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={fetchOrders}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner label="Fetching customer orders..." />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center text-xs text-stone-500">
          No orders found matching the criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord._id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                <div>
                  <span className="font-serif font-bold text-stone-900 text-sm">
                    Order #{ord._id}
                  </span>
                  <span className="text-stone-400 block sm:inline sm:ml-3">
                    Placed on {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-stone-100 text-stone-800 rounded-xl text-[10px] font-bold uppercase border border-stone-200">
                    Type: {ord.orderType}
                  </span>
                  <Link
                    to={`/orders/${ord._id}`}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition"
                    title="Inspect Invoice"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items & Address Brief */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">Recipient & Delivery</span>
                  <p className="font-bold text-stone-900">{ord.shippingAddress?.fullName || ord.shippingAddress?.name}</p>
                  <p className="text-stone-600 font-mono">{ord.shippingAddress?.phone}</p>
                  <p className="text-stone-500">
                    {ord.shippingAddress?.municipality || ord.shippingAddress?.city}, {ord.shippingAddress?.province || ord.shippingAddress?.state} Province
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">Order Value</span>
                  <p className="text-lg font-serif font-bold text-red-700">
                    Rs. {ord.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-stone-500">{ord.items.length} unique book titles</p>
                </div>
              </div>

              {/* Status Controls */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-stone-50 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-700">Fulfillment Status:</span>
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleStatusUpdate(ord._id, { orderStatus: e.target.value })}
                    className="px-2.5 py-1 bg-white border border-stone-200 rounded-xl font-bold text-stone-900"
                  >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-700">Payment Status:</span>
                  <select
                    value={ord.paymentStatus}
                    onChange={(e) => handleStatusUpdate(ord._id, { paymentStatus: e.target.value })}
                    className="px-2.5 py-1 bg-white border border-stone-200 rounded-xl font-bold text-stone-900"
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="failed">failed</option>
                  </select>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
