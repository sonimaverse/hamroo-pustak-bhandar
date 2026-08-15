import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MapPin, Phone, User, CreditCard, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';

const NEPAL_PROVINCES = [
  'Koshi',
  'Madhesh',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim',
];

export const CheckoutPage: React.FC = () => {
  const { cart, totalAmount, itemCount, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'Nepal Checkout | Hamro Pustak Bhandar';
  }, []);

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [province, setProvince] = useState('Bagmati');
  const [district, setDistrict] = useState('Kathmandu');
  const [municipality, setMunicipality] = useState('Kathmandu Metropolitan City');
  const [ward, setWard] = useState('10');
  const [tole, setTole] = useState('New Baneshwor');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Bank Transfer' | 'Online Payment'>('Cash on Delivery');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-xs text-stone-500">Please add books to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !province || !district || !municipality || !ward) {
      setError('Please complete all required shipping address fields (*).');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await orderService.createOrder({
        shippingAddress: {
          fullName,
          phone,
          province,
          district,
          municipality,
          ward,
          tole,
          streetAddress,
          deliveryNotes,
        },
        paymentMethod,
        notes: deliveryNotes,
      });

      await fetchCart(); // Refresh cart to clear
      navigate(`/orders/${res.order._id}`, {
        state: { orderCreated: true, message: 'Your order has been placed successfully!' },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </Link>
        <div className="text-xs text-stone-500 font-bold uppercase tracking-wider">
          Secure Nepal Checkout
        </div>
      </div>

      <ErrorAlert message={error || ''} onClose={() => setError(null)} />

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Nepal Delivery Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
          
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <MapPin className="w-5 h-5 text-red-700" />
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">Delivery Address (Nepal)</h2>
              <p className="text-xs text-stone-500">Provide accurate local address details for express courier delivery.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Recipient Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mobile Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +977-9841234567"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Province & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Province *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                  required
                >
                  {NEPAL_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov} Province
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">District *</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Kathmandu, Pokhara, Chitwan"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                  required
                />
              </div>
            </div>

            {/* Municipality & Ward */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Municipality / Rural Municipality *</label>
                <input
                  type="text"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  placeholder="e.g. Kathmandu Metropolitan City"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Ward No. *</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900"
                  required
                />
              </div>
            </div>

            {/* Tole & Street */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tole / Locality</label>
                <input
                  type="text"
                  value={tole}
                  onChange={(e) => setTole(e.target.value)}
                  placeholder="e.g. New Baneshwor"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Street Address / Landmark</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. Near Krishna Mandir, House #42"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                />
              </div>
            </div>

            {/* Delivery Notes */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Special Delivery Instructions</label>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Call before delivery, leave with reception"
                rows={2}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
              />
            </div>

          </div>

          {/* Payment Method Selector */}
          <div className="pt-6 border-t border-stone-100 space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-700" />
              <h2 className="text-lg font-serif font-bold text-stone-900">Payment Selection</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-2xl border text-left transition ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-red-700 bg-red-50/50 font-bold text-stone-900 shadow-2xs'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="block font-bold">Cash on Delivery</span>
                <span className="text-[10px] text-stone-500 font-normal">Pay cash upon package arrival</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Bank Transfer')}
                className={`p-4 rounded-2xl border text-left transition ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-red-700 bg-red-50/50 font-bold text-stone-900 shadow-2xs'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="block font-bold">Bank Transfer</span>
                <span className="text-[10px] text-stone-500 font-normal">Direct bank / QR payment</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Online Payment')}
                className={`p-4 rounded-2xl border text-left transition ${
                  paymentMethod === 'Online Payment'
                    ? 'border-red-700 bg-red-50/50 font-bold text-stone-900 shadow-2xs'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="block font-bold">Online Payment</span>
                <span className="text-[10px] text-stone-500 font-normal">eSewa / Khalti (Coming Soon)</span>
              </button>
            </div>

            {paymentMethod === 'Online Payment' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Notice: Direct payment gateway integration is currently pending. Selecting this will register your order as pending payment.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Confirm */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs h-fit space-y-4">
          <h3 className="text-base font-serif font-bold text-stone-900 pb-3 border-b border-stone-100">
            Order Items ({itemCount})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.bookId} className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-900 line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-stone-500">Qty: {item.quantity} x Rs. {item.unitPrice}</p>
                </div>
                <span className="font-mono font-bold text-stone-900">
                  Rs. {item.subtotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">Rs. {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping Fee</span>
              <span className="font-bold text-emerald-700">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
              <span>Total Payable</span>
              <span className="text-red-700">Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Place Order</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
