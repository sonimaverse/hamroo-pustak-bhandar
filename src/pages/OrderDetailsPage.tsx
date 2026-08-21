import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Order } from '../types/order';
import { orderService } from '../services/orderService';
import { invoiceService } from '../services/invoiceService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { Package, ArrowLeft, MapPin, Phone, User, CreditCard, CheckCircle2, Clock, Calendar, Receipt } from 'lucide-react';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const successMessage = (location.state as any)?.message;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getOrderById(id);
        setOrder(data.order);
        if (data.order?._id) {
          document.title = `Order #${data.order._id} | Hamro Pustak Bhandar`;
        }
        try {
          const inv = await invoiceService.getInvoiceByOrderId(id);
          if (inv.invoice?._id) {
            setInvoiceId(inv.invoice._id);
          }
        } catch {
          setInvoiceId(null);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto my-12 space-y-4 text-center">
        <ErrorAlert message={error || 'Order not found.'} />
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Orders History
        </Link>
      </div>
    );
  }

  const addr = order.shippingAddress;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {invoiceId && (
        <Link
          to={`/invoices/${invoiceId}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl text-xs font-bold transition"
        >
          <Receipt className="w-4 h-4" /> View Invoice
        </Link>
      )}

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        
        {/* Top Info Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
              <Package className="w-4 h-4" /> Order Invoice
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-0.5">
              Order #{order._id}
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold uppercase border border-stone-200">
              Type: {order.orderType}
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase border ${
              order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
            }`}>
              Status: {order.orderStatus}
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase border ${
              order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Address and Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-red-700" /> Delivery Address (Nepal)
            </h3>
            <div className="space-y-1 text-stone-700 font-medium leading-relaxed">
              <p><strong className="text-stone-900">Name:</strong> {addr.fullName || addr.name}</p>
              <p><strong className="text-stone-900">Contact Phone:</strong> {addr.phone}</p>
              <p>
                <strong className="text-stone-900">Address:</strong>{' '}
                {addr.tole ? `${addr.tole}, ` : ''}
                {addr.streetAddress || addr.street || ''} Ward {addr.ward || 'N/A'},{' '}
                {addr.municipality || addr.city}, {addr.district || ''}, {addr.province || addr.state} Province
              </p>
              {(addr.deliveryNotes || order.notes) && (
                <p className="text-stone-500 italic mt-1">
                  <strong>Notes:</strong> {addr.deliveryNotes || order.notes}
                </p>
              )}
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-emerald-700" /> Payment & Billing
            </h3>
            <div className="space-y-1 text-stone-700 font-medium">
              <p><strong className="text-stone-900">Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong className="text-stone-900">Payment Status:</strong> <span className="capitalize">{order.paymentStatus}</span></p>
              <p><strong className="text-stone-900">Authoritative Total:</strong> <span className="font-bold text-red-700 font-sans">Rs. {order.totalAmount.toLocaleString()}</span></p>
            </div>
          </div>

        </div>

        {/* Items Table */}
        <div className="space-y-3 pt-2">
          <h3 className="font-serif font-bold text-stone-900 text-sm">Ordered Book Items</h3>
          
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Book Title</th>
                  <th className="p-3 text-center">Unit Price</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="p-3 font-medium text-stone-900">{item.title}</td>
                    <td className="p-3 text-center font-mono text-stone-600">Rs. {item.price.toLocaleString()}</td>
                    <td className="p-3 text-center font-bold text-stone-800">{item.quantity}</td>
                    <td className="p-3 text-right font-mono font-bold text-stone-900">Rs. {item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Summary */}
        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex justify-between items-center text-sm font-bold text-stone-900">
          <span>Total Order Value:</span>
          <span className="text-xl text-red-700 font-sans">Rs. {order.totalAmount.toLocaleString()}</span>
        </div>

      </div>

    </div>
  );
};
