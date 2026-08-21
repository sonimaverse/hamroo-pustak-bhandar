import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
  Image as ImageIcon,
  ExternalLink,
  X,
  Maximize2,
  AlertCircle,
  Receipt,
} from 'lucide-react';

import { Order } from '../../types/order';
import { adminService } from '../../services/adminService';
import { invoiceService } from '../../services/invoiceService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const AdminOrdersPage: React.FC = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const [updatingOrderId, setUpdatingOrderId] =
    useState<string | null>(null);

  /*
   * Track invoice generation in progress.
   */
  const [generatingInvoiceId, setGeneratingInvoiceId] =
    useState<string | null>(null);

  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  /*
   * Currently opened payment screenshot.
   *
   * IMPORTANT:
   * We do NOT use window.open().
   * Screenshot opens inside a modal.
   */
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<string | null>(null);

  /*
   * Tracks screenshot loading errors inside the modal.
   */
  const [modalImageError, setModalImageError] =
    useState(false);

  /*
   * Tracks preview image errors inside order cards.
   */
  const [previewErrors, setPreviewErrors] =
    useState<Record<string, boolean>>({});

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminService.getOrders({
        orderStatus: statusFilter || undefined,
        paymentStatus: paymentFilter || undefined,
      });

      setOrders(
        Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data)
            ? data
            : []
      );
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);

      setError(
        err?.response?.data?.message ||
          'Failed to fetch customer orders.'
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD ORDERS
  ========================================================= */

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  /* =========================================================
     ESC KEY - CLOSE SCREENSHOT MODAL
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedScreenshot(null);
        setModalImageError(false);
      }
    };

    if (selectedScreenshot) {
      document.addEventListener(
        'keydown',
        handleKeyDown
      );

      /*
       * Prevent page behind modal from scrolling.
       */
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      document.body.style.overflow = '';
    };
  }, [selectedScreenshot]);

  /* =========================================================
     OPEN SCREENSHOT MODAL
  ========================================================= */

  const openScreenshot = (src: string) => {
    if (!src) return;

    setModalImageError(false);
    setSelectedScreenshot(src);
  };

  /* =========================================================
     CLOSE SCREENSHOT MODAL
  ========================================================= */

  const closeScreenshot = () => {
    setSelectedScreenshot(null);
    setModalImageError(false);
  };

  /* =========================================================
     UPDATE ORDER / PAYMENT STATUS
  ========================================================= */

  const handleStatusUpdate = async (
    id: string,
    updates: {
      orderStatus?: string;
      paymentStatus?: string;
    }
  ) => {
    try {
      setUpdatingOrderId(id);
      setError(null);

      await adminService.updateOrderStatus(
        id,
        updates
      );

      await fetchOrders();
    } catch (err: any) {
      console.error(
        'Status update failed:',
        err
      );

      setError(
        err?.response?.data?.message ||
          'Failed to update order status.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  /* =========================================================
      GENERATE INVOICE FROM ORDER
   ========================================================= */

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      setGeneratingInvoiceId(orderId);
      setInvoiceError(null);

      const data = await invoiceService.generateFromOrder(orderId, {
        discount: 0,
        tax: 0,
      });

      await fetchOrders();

      /*
       * Open invoice view in a new tab/route.
       */
      window.open(`/admin/invoices/${data.invoice._id}`, '_blank');
    } catch (err: any) {
      console.error('Invoice generation failed:', err);

      setInvoiceError(
        err?.response?.data?.message ||
          'Failed to generate invoice.'
      );
    } finally {
      setGeneratingInvoiceId(null);
    }
  };

  /* =========================================================
     PAYMENT BADGE
  ========================================================= */

  const getPaymentBadge = (
    status: string
  ) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Paid
          </span>
        );

      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold uppercase">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 text-[11px] font-bold uppercase">
            <Clock3 className="w-3.5 h-3.5" />
            Unpaid
          </span>
        );
    }
  };

  /* =========================================================
     ORDER STATUS BADGE
  ========================================================= */

  const getOrderStatusBadge = (
    status: string
  ) => {
    const classes: Record<
      string,
      string
    > = {
      pending:
        'bg-yellow-100 text-yellow-700 border-yellow-200',

      processing:
        'bg-blue-100 text-blue-700 border-blue-200',

      shipped:
        'bg-purple-100 text-purple-700 border-purple-200',

      delivered:
        'bg-green-100 text-green-700 border-green-200',

      cancelled:
        'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <span
        className={`inline-flex px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase ${
          classes[status] ||
          'bg-stone-100 text-stone-700 border-stone-200'
        }`}
      >
        {status || 'pending'}
      </span>
    );
  };

  /* =========================================================
     PAYMENT SCREENSHOT NORMALIZER
  ========================================================= */

  const getScreenshotUrl = (
    order: Order
  ): string => {
    const raw =
      (order as any).paymentScreenshot ??
      (order as any).paymentProof ??
      (order as any).paymentImage ??
      '';

    if (!raw) {
      return '';
    }

    /*
     * Normal string:
     *
     * https://...
     * /uploads/...
     * data:image/...
     */
    if (typeof raw === 'string') {
      return raw.trim();
    }

    /*
     * Object-style Cloudinary/upload value.
     */
    if (
      typeof raw === 'object' &&
      raw !== null
    ) {
      return (
        raw.url ||
        raw.secure_url ||
        raw.path ||
        raw.src ||
        ''
      );
    }

    return '';
  };

  /* =========================================================
     HANDLE PREVIEW IMAGE ERROR
  ========================================================= */

  const handlePreviewError = (
    orderId: string
  ) => {
    setPreviewErrors((previous) => ({
      ...previous,
      [orderId]: true,
    }));
  };

  /* =========================================================
     SUMMARY COUNTS
  ========================================================= */

  const totalOrders = orders.length;

  const unpaidOrders = orders.filter(
    (o) => o.paymentStatus === 'pending'
  ).length;

  const paidOrders = orders.filter(
    (o) => o.paymentStatus === 'paid'
  ).length;

  const failedOrders = orders.filter(
    (o) => o.paymentStatus === 'failed'
  ).length;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto pb-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">

            <div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">

                <ShoppingBag className="w-4 h-4" />

                <span>
                  Fulfilment & Payment
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                Store Orders Console
              </h1>

              <p className="text-sm text-stone-500 mt-1">
                Manage orders, verify payment screenshots and update payment status.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              {/* ORDER FILTER */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="px-3 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 outline-none"
              >
                <option value="">
                  All Order Statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="shipped">
                  Shipped
                </option>

                <option value="delivered">
                  Delivered
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

              {/* PAYMENT FILTER */}

              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(
                    e.target.value
                  )
                }
                className="px-3 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 outline-none"
              >
                <option value="">
                  All Payments
                </option>

                <option value="pending">
                  Unpaid / Pending
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="failed">
                  Failed
                </option>
              </select>

              {/* REFRESH */}

              <button
                type="button"
                onClick={fetchOrders}
                disabled={loading}
                className="p-2.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-800 rounded-xl transition"
                title="Refresh orders"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading
                      ? 'animate-spin'
                      : ''
                  }`}
                />
              </button>

            </div>

          </div>

          {/* ===================================================
              SUMMARY
          ==================================================== */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">

            <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4">

              <p className="text-[10px] uppercase font-bold text-stone-400">
                Total Orders
              </p>

              <p className="text-xl font-bold text-stone-900 mt-1">
                {totalOrders}
              </p>

            </div>

            <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">

              <p className="text-[10px] uppercase font-bold text-yellow-600">
                Unpaid
              </p>

              <p className="text-xl font-bold text-yellow-800 mt-1">
                {unpaidOrders}
              </p>

            </div>

            <div className="rounded-2xl bg-green-50 border border-green-200 p-4">

              <p className="text-[10px] uppercase font-bold text-green-600">
                Paid
              </p>

              <p className="text-xl font-bold text-green-800 mt-1">
                {paidOrders}
              </p>

            </div>

            <div className="rounded-2xl bg-red-50 border border-red-200 p-4">

              <p className="text-[10px] uppercase font-bold text-red-600">
                Failed
              </p>

              <p className="text-xl font-bold text-red-800 mt-1">
                {failedOrders}
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <ErrorAlert
            message={error}
            onClose={() =>
              setError(null)
            }
          />
        )}

        {invoiceError && (
          <ErrorAlert
            message={invoiceError}
            onClose={() =>
              setInvoiceError(null)
            }
          />
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading ? (

          <LoadingSpinner
            label="Fetching customer orders..."
          />

        ) : orders.length === 0 ? (

          /* ===================================================
             EMPTY
          ==================================================== */

          <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center">

            <ShoppingBag className="w-10 h-10 mx-auto text-stone-300" />

            <h3 className="font-bold text-stone-800 mt-3">
              No orders found
            </h3>

            <p className="text-xs text-stone-500 mt-1">
              No orders match the selected filters.
            </p>

          </div>

        ) : (

          /* ===================================================
             ORDERS
          ==================================================== */

          <div className="space-y-5">

            {orders.map((ord) => {

              const screenshot =
                getScreenshotUrl(ord);

              const isUpdating =
                updatingOrderId ===
                ord._id;

              const previewFailed =
                !!previewErrors[
                  ord._id
                ];

              return (

                <div
                  key={ord._id}
                  className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm"
                >

                  {/* =================================================
                      ORDER HEADER
                  ================================================== */}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="font-mono font-bold text-stone-900 text-sm break-all">
                          #{ord._id}
                        </span>

                        <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-xl text-[10px] font-bold uppercase border border-stone-200">
                          {ord.orderType ||
                            'regular'}
                        </span>

                      </div>

                      <p className="text-xs text-stone-400 mt-1">
                        Placed on{' '}
                        {new Date(
                          ord.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-2">

                      {getPaymentBadge(
                        ord.paymentStatus
                      )}

                      {getOrderStatusBadge(
                        ord.orderStatus
                      )}

                      <Link
                        to={`/orders/${ord._id}`}
                        className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition"
                        title="View order"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleGenerateInvoice(
                            ord._id
                          )
                        }
                        disabled={
                          generatingInvoiceId ===
                          ord._id
                        }
                        className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition disabled:opacity-50"
                        title="Generate invoice"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      CUSTOMER + ORDER VALUE + PAYMENT
                  ================================================== */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">

                    {/* =================================================
                        CUSTOMER
                    ================================================== */}

                    <div>

                      <span className="text-stone-400 font-bold block mb-2 uppercase tracking-wider text-[10px]">
                        Recipient & Delivery
                      </span>

                      <p className="font-bold text-stone-900">
                        {ord
                          .shippingAddress
                          ?.fullName ||
                          (ord
                            .shippingAddress as any)
                            ?.name ||
                          'N/A'}
                      </p>

                      <p className="text-stone-600 text-xs mt-1">
                        {ord
                          .shippingAddress
                          ?.phone ||
                          'No phone'}
                      </p>

                      <p className="text-stone-500 text-xs mt-1">
                        {ord
                          .shippingAddress
                          ?.municipality ||
                          (ord
                            .shippingAddress as any)
                            ?.city ||
                          'N/A'}

                        {ord
                          .shippingAddress
                          ?.district
                          ? `, ${ord.shippingAddress.district}`
                          : ''}
                      </p>

                      <p className="text-stone-500 text-xs">

                        {ord
                          .shippingAddress
                          ?.province ||
                          (ord
                            .shippingAddress as any)
                            ?.state ||
                          ''}

                        {ord
                          .shippingAddress
                          ?.province
                          ? ' Province'
                          : ''}

                      </p>

                      {ord
                        .shippingAddress
                        ?.ward && (
                        <p className="text-stone-500 text-xs">
                          Ward{' '}
                          {
                            ord
                              .shippingAddress
                              .ward
                          }
                        </p>
                      )}

                      {ord
                        .shippingAddress
                        ?.tole && (
                        <p className="text-stone-500 text-xs">
                          Tole:{' '}
                          {
                            ord
                              .shippingAddress
                              .tole
                          }
                        </p>
                      )}

                      {ord
                        .shippingAddress
                        ?.streetAddress && (
                        <p className="text-stone-500 text-xs mt-1">
                          {
                            ord
                              .shippingAddress
                              .streetAddress
                          }
                        </p>
                      )}

                    </div>

                    {/* =================================================
                        ORDER VALUE
                    ================================================== */}

                    <div>

                      <span className="text-stone-400 font-bold block mb-2 uppercase tracking-wider text-[10px]">
                        Order Value
                      </span>

                      <p className="text-2xl font-serif font-bold text-red-700">
                        Rs.{' '}
                        {Number(
                          ord.totalAmount ||
                            0
                        ).toLocaleString()}
                      </p>

                      <p className="text-xs text-stone-500 mt-1">
                        {ord.items?.length ||
                          0}{' '}
                        unique book titles
                      </p>

                      <p className="text-xs text-stone-500 mt-1">
                        Payment:{' '}
                        <span className="font-semibold text-stone-700">
                          {ord.paymentMethod ||
                            'N/A'}
                        </span>
                      </p>

                      {ord.notes && (
                        <p className="text-xs text-stone-500 mt-2">
                          Note:{' '}
                          <span className="text-stone-700">
                            {ord.notes}
                          </span>
                        </p>
                      )}

                    </div>

                    {/* =================================================
                        PAYMENT PROOF
                    ================================================== */}

                    <div>

                      <span className="text-stone-400 font-bold block mb-2 uppercase tracking-wider text-[10px]">
                        Payment Proof
                      </span>

                      {screenshot ? (

                        <div className="space-y-3">

                          {/* =========================================
                              IMAGE PREVIEW
                          ========================================== */}

                          <div
                            className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 w-fit cursor-pointer group"
                            onClick={() =>
                              !previewFailed &&
                              openScreenshot(
                                screenshot
                              )
                            }
                          >

                            {!previewFailed ? (

                              <>
                                <img
                                  src={
                                    screenshot
                                  }
                                  alt="Customer payment screenshot"
                                  className="w-48 h-32 object-cover group-hover:scale-105 group-hover:opacity-80 transition duration-300"
                                  onError={() =>
                                    handlePreviewError(
                                      ord._id
                                    )
                                  }
                                />

                                {/* Hover overlay */}

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">

                                  <div className="opacity-0 group-hover:opacity-100 transition bg-white/90 rounded-full p-2 shadow-lg">

                                    <Maximize2 className="w-5 h-5 text-stone-800" />

                                  </div>

                                </div>
                              </>

                            ) : (

                              <div className="w-48 h-32 flex flex-col items-center justify-center text-center px-4">

                                <AlertCircle className="w-7 h-7 text-red-400 mb-2" />

                                <p className="text-[11px] font-bold text-red-600">
                                  Image unavailable
                                </p>

                                <p className="text-[9px] text-stone-400 mt-1">
                                  Unable to load payment proof
                                </p>

                              </div>

                            )}

                          </div>

                          {/* =========================================
                              BUTTONS
                          ========================================== */}

                          <div className="flex flex-wrap items-center gap-2">

                            {!previewFailed && (
                              <button
                                type="button"
                                onClick={() =>
                                  openScreenshot(
                                    screenshot
                                  )
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl text-xs font-bold transition"
                              >
                                <ImageIcon className="w-4 h-4" />

                                View Screenshot
                              </button>
                            )}

                            {!previewFailed && (
                              <button
                                type="button"
                                onClick={() =>
                                  openScreenshot(
                                    screenshot
                                  )
                                }
                                className="p-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 transition"
                                title="Open screenshot"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            )}

                          </div>

                          {/* =========================================
                              DATA URL INFO
                          ========================================== */}

                          {screenshot.startsWith(
                            'data:image/'
                          ) && (
                            <p className="text-[10px] text-stone-400">
                              Payment screenshot stored as image data.
                            </p>
                          )}

                        </div>

                      ) : (

                        <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-50 border border-stone-200 rounded-xl px-3 py-3">

                          <ImageIcon className="w-4 h-4" />

                          No payment screenshot uploaded

                        </div>

                      )}

                    </div>

                  </div>

                  {/* =================================================
                      STATUS CONTROLS
                  ================================================== */}

                  <div className="pt-4 border-t border-stone-100">

                    <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4">

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* ===========================================
                            ORDER STATUS
                        ============================================ */}

                        <div>

                          <label className="font-bold text-stone-700 text-xs block mb-2">
                            Fulfillment Status
                          </label>

                          <select
                            value={
                              ord.orderStatus ||
                              'pending'
                            }
                            disabled={
                              isUpdating
                            }
                            onChange={(e) =>
                              handleStatusUpdate(
                                ord._id,
                                {
                                  orderStatus:
                                    e
                                      .target
                                      .value,
                                }
                              )
                            }
                            className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 outline-none disabled:opacity-50"
                          >

                            <option value="pending">
                              Pending
                            </option>

                            <option value="processing">
                              Processing
                            </option>

                            <option value="shipped">
                              Shipped
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>

                          </select>

                        </div>

                        {/* ===========================================
                            PAYMENT STATUS
                        ============================================ */}

                        <div>

                          <label className="font-bold text-stone-700 text-xs block mb-2">
                            Payment Verification
                          </label>

                          <select
                            value={
                              ord.paymentStatus ||
                              'pending'
                            }
                            disabled={
                              isUpdating
                            }
                            onChange={(e) =>
                              handleStatusUpdate(
                                ord._id,
                                {
                                  paymentStatus:
                                    e
                                      .target
                                      .value,
                                }
                              )
                            }
                            className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 outline-none disabled:opacity-50"
                          >

                            <option value="pending">
                              Unpaid / Pending
                            </option>

                            <option value="paid">
                              Paid — Verified
                            </option>

                            <option value="failed">
                              Failed / Rejected
                            </option>

                          </select>

                        </div>

                      </div>

                      {/* =============================================
                          QUICK PAYMENT ACTIONS
                      ============================================== */}

                      <div className="flex flex-wrap items-center gap-2 mt-4">

                        <span className="text-[10px] uppercase font-bold text-stone-400 mr-1">
                          Quick action:
                        </span>

                        {/* MARK PAID */}

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            ord.paymentStatus ===
                              'paid'
                          }
                          onClick={() =>
                            handleStatusUpdate(
                              ord._id,
                              {
                                paymentStatus:
                                  'paid',
                              }
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl text-xs font-bold disabled:opacity-40 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />

                          Mark Paid
                        </button>

                        {/* MARK UNPAID */}

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            ord.paymentStatus ===
                              'pending'
                          }
                          onClick={() =>
                            handleStatusUpdate(
                              ord._id,
                              {
                                paymentStatus:
                                  'pending',
                              }
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl text-xs font-bold disabled:opacity-40 transition"
                        >
                          <Clock3 className="w-3.5 h-3.5" />

                          Mark Unpaid
                        </button>

                        {/* REJECT */}

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            ord.paymentStatus ===
                              'failed'
                          }
                          onClick={() =>
                            handleStatusUpdate(
                              ord._id,
                              {
                                paymentStatus:
                                  'failed',
                              }
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold disabled:opacity-40 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />

                          Reject Payment
                        </button>

                        {isUpdating && (
                          <span className="text-[11px] text-stone-400 font-semibold">
                            Updating...
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* =========================================================
          PAYMENT SCREENSHOT MODAL
          
          IMPORTANT:
          No window.open().
          No browser popup.
          Everything happens inside React.
      ========================================================= */}

      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={closeScreenshot}
          role="dialog"
          aria-modal="true"
          aria-label="Payment screenshot viewer"
        >

          {/* =====================================================
              MODAL CONTAINER
          ====================================================== */}

          <div
            className="relative w-full max-w-6xl h-[92vh] bg-stone-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ===================================================
                MODAL HEADER
            ==================================================== */}

            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-white/10 bg-stone-950/95">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">

                  <ImageIcon className="w-5 h-5 text-purple-300" />

                </div>

                <div className="min-w-0">

                  <h2 className="text-sm sm:text-base font-bold text-white truncate">
                    Payment Screenshot
                  </h2>

                  <p className="text-[10px] sm:text-xs text-stone-400">
                    Customer payment proof
                  </p>

                </div>

              </div>

              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={closeScreenshot}
                className="w-10 h-10 shrink-0 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                title="Close"
                aria-label="Close screenshot"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* ===================================================
                IMAGE VIEW AREA
            ==================================================== */}

            <div className="flex-1 min-h-0 flex items-center justify-center p-4 sm:p-8 overflow-auto">

              {!modalImageError ? (

                <img
                  src={
                    selectedScreenshot
                  }
                  alt="Customer payment screenshot"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl select-none"
                  onError={() =>
                    setModalImageError(
                      true
                    )
                  }
                />

              ) : (

                /* ===============================================
                   IMAGE ERROR FALLBACK
                =============================================== */

                <div className="flex flex-col items-center justify-center text-center max-w-sm">

                  <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">

                    <AlertCircle className="w-10 h-10 text-red-400" />

                  </div>

                  <h3 className="text-lg font-bold text-white mt-5">
                    Unable to load screenshot
                  </h3>

                  <p className="text-sm text-stone-400 mt-2">
                    The payment screenshot could not be loaded. The stored image URL may be invalid or unavailable.
                  </p>

                  <button
                    type="button"
                    onClick={closeScreenshot}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-white text-stone-900 rounded-xl text-xs font-bold hover:bg-stone-100 transition"
                  >
                    <X className="w-4 h-4" />
                    Close
                  </button>

                </div>

              )}

            </div>

            {/* ===================================================
                MODAL FOOTER
            ==================================================== */}

            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-white/10 bg-stone-950/95">

              <p className="text-[10px] sm:text-xs text-stone-500">
                Click outside or press{' '}
                <span className="text-stone-300 font-bold">
                  Esc
                </span>{' '}
                to close
              </p>

              <button
                type="button"
                onClick={closeScreenshot}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
              >
                <X className="w-4 h-4" />
                Close
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};