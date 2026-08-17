import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Mail,
  QrCode,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react';

import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { ErrorAlert } from '../components/common/ErrorAlert';
import paymentQR from '../assets/payment-qr.jpeg';

const NEPAL_PROVINCES = [
  'Koshi',
  'Madhesh',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim',
] as const;

type PaymentMethod = 'Cash on Delivery' | 'Bank Transfer';

export const CheckoutPage: React.FC = () => {
  const { cart, totalAmount, itemCount, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Checkout | Hamro Pustak Bhandar';
  }, []);

  /* =========================================================
     SHIPPING ADDRESS
  ========================================================= */

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [province, setProvince] = useState('Bagmati');
  const [district, setDistrict] = useState('Kathmandu');

  const [municipality, setMunicipality] = useState(
    'Kathmandu Metropolitan City'
  );

  const [ward, setWard] = useState('10');
  const [tole, setTole] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  /* =========================================================
     PAYMENT
  ========================================================= */

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('Cash on Delivery');

  const [paymentScreenshot, setPaymentScreenshot] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  /* =========================================================
     UI STATE
  ========================================================= */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================================================
     CLEAN PREVIEW URL
  ========================================================= */

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-stone-900">
          Your Cart is Empty
        </h2>

        <p className="text-xs text-stone-500">
          Please add books to your cart before proceeding to checkout.
        </p>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800 transition"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  /* =========================================================
     PAYMENT METHOD CHANGE
  ========================================================= */

  const handlePaymentMethodChange = (
    method: PaymentMethod
  ) => {
    setPaymentMethod(method);

    /*
     * If customer switches back to COD,
     * remove screenshot because it is not needed.
     */
    if (method === 'Cash on Delivery') {
      setPaymentScreenshot(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }

    setError(null);
  };

  /* =========================================================
     SCREENSHOT SELECT
  ========================================================= */

  const handleScreenshotChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /* Only images */
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file only.');
      e.target.value = '';
      return;
    }

    /* Maximum 5MB */
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError('Payment screenshot must be smaller than 5MB.');
      e.target.value = '';
      return;
    }

    /* Remove old preview */
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPaymentScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  /* =========================================================
     REMOVE SCREENSHOT
  ========================================================= */

  const removeScreenshot = () => {
    setPaymentScreenshot(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setError(null);
  };

  /* =========================================================
     SUBMIT ORDER
  ========================================================= */

  const handleSubmitOrder = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);

    /* -------------------------------------------------------
       Validate shipping information
    ------------------------------------------------------- */

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !province ||
      !district.trim() ||
      !municipality.trim() ||
      !ward.trim()
    ) {
      setError(
        'Please complete all required shipping address fields (*).'
      );
      return;
    }

    /* -------------------------------------------------------
       Validate payment screenshot for bank transfer
    ------------------------------------------------------- */

    if (
      paymentMethod === 'Bank Transfer' &&
      !paymentScreenshot
    ) {
      setError(
        'Please upload your payment screenshot after completing the QR/bank payment.'
      );
      return;
    }

    try {
      setLoading(true);

      const orderItems = cart.items.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      }));

      /* -----------------------------------------------------
         Create order
      ----------------------------------------------------- */

      const res = await orderService.createOrder(
        {
          items: orderItems,

          shippingAddress: {
            fullName: fullName.trim(),
            phone: phone.trim(),
            province,
            district: district.trim(),
            municipality: municipality.trim(),
            ward: ward.trim(),
            tole: tole.trim(),
            streetAddress: streetAddress.trim(),
            deliveryNotes: deliveryNotes.trim(),
          },

          paymentMethod,

          notes: deliveryNotes.trim(),
        },

        /*
         * Screenshot is uploaded only when selected.
         */
        paymentScreenshot
      );

      /* -----------------------------------------------------
         Refresh cart
      ----------------------------------------------------- */

      await fetchCart();

      /* -----------------------------------------------------
         Navigate to order details
      ----------------------------------------------------- */

      navigate(`/orders/${res.order._id}`, {
        state: {
          orderCreated: true,
          message:
            'Your order has been placed successfully!',
        },
      });
    } catch (err: any) {
      console.error('Checkout error:', err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Failed to submit order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Cart
        </Link>

        <div className="text-xs text-stone-500 font-bold uppercase tracking-wider">
          Secure Nepal Checkout
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <ErrorAlert
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* =====================================================
          CHECKOUT FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmitOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >

        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">

          {/* =================================================
              DELIVERY ADDRESS
          ================================================= */}

          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <MapPin className="w-5 h-5 text-red-700" />

            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Delivery Address
              </h2>

              <p className="text-xs text-stone-500">
                Provide accurate local address details for delivery.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">

            {/* NAME + PHONE */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Name *
                </label>

                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Mobile Phone Number *
                </label>

                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="e.g. 98XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                </div>
              </div>

            </div>

            {/* PROVINCE + DISTRICT */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Province *
                </label>

                <select
                  value={province}
                  onChange={(e) =>
                    setProvince(e.target.value)
                  }
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-200"
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
                <label className="block font-bold text-stone-700 mb-1">
                  District *
                </label>

                <input
                  type="text"
                  value={district}
                  onChange={(e) =>
                    setDistrict(e.target.value)
                  }
                  placeholder="e.g. Chitwan"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                  required
                />
              </div>

            </div>

            {/* MUNICIPALITY + WARD */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  Municipality / Rural Municipality *
                </label>

                <input
                  type="text"
                  value={municipality}
                  onChange={(e) =>
                    setMunicipality(e.target.value)
                  }
                  placeholder="e.g. Bharatpur Metropolitan City"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Ward No. *
                </label>

                <input
                  type="text"
                  value={ward}
                  onChange={(e) =>
                    setWard(e.target.value)
                  }
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                  required
                />
              </div>

            </div>

            {/* TOLE + STREET */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Tole / Locality
                </label>

                <input
                  type="text"
                  value={tole}
                  onChange={(e) =>
                    setTole(e.target.value)
                  }
                  placeholder="e.g. New Baneshwor"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Street Address / Landmark
                </label>

                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) =>
                    setStreetAddress(e.target.value)
                  }
                  placeholder="House number / nearby landmark"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

            </div>

            {/* DELIVERY NOTES */}

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Special Delivery Instructions
              </label>

              <textarea
                value={deliveryNotes}
                onChange={(e) =>
                  setDeliveryNotes(e.target.value)
                }
                placeholder="e.g. Call before delivery"
                rows={2}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>

          </div>

          {/* =================================================
              PAYMENT
          ================================================= */}

          <div className="pt-6 border-t border-stone-100 space-y-4">

            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-700" />

              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  Payment Method
                </h2>

                <p className="text-xs text-stone-500">
                  Choose how you want to pay for your order.
                </p>
              </div>
            </div>

            {/* PAYMENT OPTIONS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

              {/* COD */}

              <button
                type="button"
                onClick={() =>
                  handlePaymentMethodChange(
                    'Cash on Delivery'
                  )
                }
                className={`p-4 rounded-2xl border text-left transition ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-red-700 bg-red-50 font-bold text-stone-900'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="block font-bold">
                  Cash on Delivery
                </span>

                <span className="text-[10px] text-stone-500 font-normal">
                  Pay cash when your order arrives.
                </span>
              </button>

              {/* BANK */}

              <button
                type="button"
                onClick={() =>
                  handlePaymentMethodChange(
                    'Bank Transfer'
                  )
                }
                className={`p-4 rounded-2xl border text-left transition ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-red-700 bg-red-50 font-bold text-stone-900'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="block font-bold">
                  QR / Bank Transfer
                </span>

                <span className="text-[10px] text-stone-500 font-normal">
                  Pay first and upload your payment screenshot.
                </span>
              </button>

            </div>

            {/* =================================================
                QR PAYMENT
            ================================================= */}

            {paymentMethod === 'Bank Transfer' && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-5">

                {/* QR HEADER */}

                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-700" />

                  <div>
                    <h3 className="font-bold text-stone-900">
                      QR Payment
                    </h3>

                    <p className="text-[11px] text-stone-600">
                      Scan the QR code and pay the exact order amount.
                    </p>
                  </div>
                </div>

                {/* QR IMAGE */}

                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-200">
                    <img
                      src={paymentQR}
                      alt="Hamro Pustak Bhandar QR Payment"
                      className="w-64 h-64 object-contain rounded-xl"
                    />
                  </div>
                </div>

                {/* PAYMENT DETAILS */}

                <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-red-700 shrink-0" />

                    <div>
                      <p className="text-[10px] text-stone-500">
                        Payment / Contact Number
                      </p>

                      <p className="text-xs font-bold text-stone-900">
                        9866115029
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-red-700 shrink-0" />

                    <div>
                      <p className="text-[10px] text-stone-500">
                        Email
                      </p>

                      <p className="text-xs font-bold text-stone-900 break-all">
                        hamropustakbhandar7@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-red-700 shrink-0" />

                    <div>
                      <p className="text-[10px] text-stone-500">
                        Store Location
                      </p>

                      <p className="text-xs font-bold text-stone-900">
                        Near Om Shanti Academy, Bharatpur, Chitwan
                      </p>
                    </div>
                  </div>

                </div>

                {/* AMOUNT */}

                <div className="bg-amber-100 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900">
                  <strong>Important:</strong> Please pay the exact
                  order amount of{' '}
                  <strong>
                    Rs. {totalAmount.toLocaleString()}
                  </strong>{' '}
                  using the QR code.
                </div>

                {/* =================================================
                    SCREENSHOT UPLOAD
                ================================================= */}

                <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4">

                  <div>
                    <h3 className="font-bold text-stone-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-red-700" />
                      Payment Screenshot
                      <span className="text-red-600">*</span>
                    </h3>

                    <p className="text-[10px] text-stone-500 mt-1">
                      Upload the screenshot/receipt after completing payment.
                      Maximum size: 5MB.
                    </p>
                  </div>

                  {!paymentScreenshot ? (
                    <label className="block cursor-pointer">

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />

                      <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-red-400 hover:bg-red-50 transition">

                        <Upload className="w-8 h-8 mx-auto text-stone-400 mb-2" />

                        <p className="text-xs font-bold text-stone-700">
                          Click to upload payment screenshot
                        </p>

                        <p className="text-[10px] text-stone-500 mt-1">
                          JPG, JPEG, PNG or WEBP
                        </p>

                      </div>

                    </label>
                  ) : (
                    <div className="space-y-3">

                      {/* PREVIEW */}

                      {previewUrl && (
                        <div className="relative bg-stone-50 rounded-2xl border border-stone-200 p-3">

                          <img
                            src={previewUrl}
                            alt="Payment screenshot preview"
                            className="w-full max-h-80 object-contain rounded-xl"
                          />

                          <button
                            type="button"
                            onClick={removeScreenshot}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center hover:bg-red-800 transition shadow"
                            title="Remove screenshot"
                          >
                            <X className="w-4 h-4" />
                          </button>

                        </div>
                      )}

                      {/* FILE NAME */}

                      <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">

                        <div className="flex items-center gap-2 min-w-0">

                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                          <span className="text-[10px] font-bold text-emerald-800 truncate">
                            {paymentScreenshot.name}
                          </span>

                        </div>

                        <button
                          type="button"
                          onClick={removeScreenshot}
                          className="text-[10px] font-bold text-red-600 hover:text-red-800 shrink-0"
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

        {/* =====================================================
            RIGHT COLUMN
        ===================================================== */}

        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs h-fit space-y-4">

          <h3 className="text-base font-serif font-bold text-stone-900 pb-3 border-b border-stone-100">
            Order Items ({itemCount})
          </h3>

          {/* ITEMS */}

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">

            {cart.items.map((item) => (
              <div
                key={item.bookId}
                className="flex items-center justify-between text-xs gap-3"
              >

                <div className="min-w-0">

                  <p className="font-bold text-stone-900 line-clamp-1">
                    {item.title}
                  </p>

                  <p className="text-[10px] text-stone-500">
                    Qty: {item.quantity} × Rs.{' '}
                    {item.unitPrice}
                  </p>

                </div>

                <span className="font-mono font-bold text-stone-900 shrink-0">
                  Rs. {item.subtotal.toLocaleString()}
                </span>

              </div>
            ))}

          </div>

          {/* TOTAL */}

          <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">

            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>

              <span className="font-bold text-stone-900">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Shipping Fee</span>

              <span className="font-bold text-emerald-700">
                FREE
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">

              <span>Total Payable</span>

              <span className="text-red-700">
                Rs. {totalAmount.toLocaleString()}
              </span>

            </div>

          </div>

          {/* PAYMENT SELECTED */}

          <div className="bg-stone-50 rounded-xl p-3 text-xs">

            <p className="text-[10px] text-stone-500 uppercase font-bold">
              Payment Method
            </p>

            <p className="font-bold text-stone-900 mt-1">
              {paymentMethod}
            </p>

            {paymentMethod === 'Bank Transfer' && (
              <p className="text-[10px] text-amber-700 mt-1">
                Payment screenshot required
              </p>
            )}

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>
                {paymentMethod === 'Bank Transfer'
                  ? 'Uploading & Placing Order...'
                  : 'Placing Order...'}
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />

                <span>
                  Confirm & Place Order
                </span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-stone-500">
            By placing your order, you confirm that the delivery
            information provided is correct.
          </p>

        </div>

      </form>
    </div>
  );
};