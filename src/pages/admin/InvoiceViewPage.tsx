import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceService } from '../../services/invoiceService';
import { Invoice } from '../../types/invoice';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Clock3,
  AlertCircle,
  PlusCircle,
  X,
} from 'lucide-react';

export const InvoiceViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // payment form
  const [showPayForm, setShowPayForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const fetchInvoice = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getInvoiceById(id);
      setInvoice(data.invoice);
      setAmount(String(Number(data.invoice.dueAmount) || 0));
      setPaymentMethod(data.invoice.paymentMethod || 'Cash on Delivery');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load invoice.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold uppercase">
            <Clock3 className="w-3.5 h-3.5" /> Partial
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold uppercase">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 text-[11px] font-bold uppercase">
            <Clock3 className="w-3.5 h-3.5" /> Due
          </span>
        );
    }
  };

  const handleRecordPayment = async () => {
    if (!invoice) return;
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setPayError('Enter a valid payment amount.');
      return;
    }
    try {
      setSaving(true);
      setPayError(null);
      const data = await invoiceService.recordPayment(invoice._id, {
        amount: amt,
        paymentMethod,
        notes,
      });
      setInvoice(data.invoice);
      setShowPayForm(false);
      setNotes('');
    } catch (err: any) {
      setPayError(err?.response?.data?.message || 'Failed to record payment.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading invoice..." />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-xl mx-auto my-12 space-y-4 text-center">
        <ErrorAlert message={error || 'Invoice not found.'} />
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const orderId = typeof invoice.orderId === 'object' ? invoice.orderId._id : invoice.orderId;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
            <button
              onClick={() => setShowPayForm(true)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl text-xs font-bold transition"
            >
              <PlusCircle className="w-4 h-4" /> Record Payment
            </button>
          )}
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Invoice Document */}
      <div id="invoice-print-area" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100 print:border-stone-400">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
              <span>Hamro Pustak Bhandar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-0.5">
              Invoice #{invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Issued on {new Date(invoice.invoiceDate).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">{getStatusBadge(invoice.status)}</div>
        </div>

        {/* Billing + Order info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">
              Bill To
            </h3>
            <div className="space-y-1 text-stone-700 font-medium leading-relaxed">
              {invoice.billingAddress ? (
                <>
                  <p>
                    <strong className="text-stone-900">
                      {invoice.billingAddress.fullName ||
                        invoice.billingAddress.name}
                    </strong>
                  </p>
                  <p>{invoice.billingAddress.phone}</p>
                  <p>
                    {invoice.billingAddress.tole ? `${invoice.billingAddress.tole}, ` : ''}
                    {invoice.billingAddress.streetAddress || ''} Ward{' '}
                    {invoice.billingAddress.ward || 'N/A'},{' '}
                    {invoice.billingAddress.municipality || invoice.billingAddress.city},{' '}
                    {invoice.billingAddress.district || ''},{' '}
                    {invoice.billingAddress.province || invoice.billingAddress.state} Province
                  </p>
                </>
              ) : (
                <p className="text-stone-500 italic">No billing address on record.</p>
              )}
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">
              Invoice Details
            </h3>
            <div className="space-y-1 text-stone-700 font-medium">
              <p>
                <strong className="text-stone-900">Order:</strong>{' '}
                <span className="font-mono">{orderId}</span>
              </p>
              <p>
                <strong className="text-stone-900">Payment Method:</strong>{' '}
                {invoice.paymentMethod}
              </p>
              <p>
                <strong className="text-stone-900">Due Date:</strong>{' '}
                {invoice.dueDate
                  ? new Date(invoice.dueDate).toLocaleDateString()
                  : 'On receipt'}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3 pt-2">
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
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="p-3 font-medium text-stone-900">{item.title}</td>
                    <td className="p-3 text-center font-mono text-stone-600">
                      Rs. {Number(item.price).toLocaleString()}
                    </td>
                    <td className="p-3 text-center font-bold text-stone-800">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-stone-900">
                      Rs. {Number(item.subtotal).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end space-y-2 text-sm">
          <div className="flex justify-between w-full sm:w-72 px-4 py-1">
            <span className="text-stone-600">Subtotal</span>
            <span className="font-mono font-bold text-stone-900">
              Rs. {Number(invoice.subtotal).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between w-full sm:w-72 px-4 py-1">
            <span className="text-stone-600">Discount</span>
            <span className="font-mono font-bold text-stone-900">
              - Rs. {Number(invoice.discount).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between w-full sm:w-72 px-4 py-1">
            <span className="text-stone-600">Tax</span>
            <span className="font-mono font-bold text-stone-900">
              + Rs. {Number(invoice.tax).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between w-full sm:w-72 px-4 py-2 border-t border-stone-200 mt-1">
            <span className="font-bold text-stone-900">Total</span>
            <span className="font-mono font-bold text-xl text-red-700">
              Rs. {Number(invoice.total).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between w-full sm:w-72 px-4 py-1">
            <span className="text-stone-600">Paid</span>
            <span className="font-mono font-bold text-green-700">
              Rs. {Number(invoice.paidAmount).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between w-full sm:w-72 px-4 py-2 border-t border-stone-200 mt-1">
            <span className="font-bold text-stone-900">Due</span>
            <span className="font-mono font-bold text-xl text-yellow-700">
              Rs. {Number(invoice.dueAmount).toLocaleString()}
            </span>
          </div>
        </div>

        {invoice.notes && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700">
            <strong className="text-stone-900">Notes:</strong> {invoice.notes}
          </div>
        )}

        {/* Payment History */}
        {invoice.paymentRecords && invoice.paymentRecords.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Payment History</h3>
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Notes</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {invoice.paymentRecords.map((pay) => (
                    <tr key={pay._id}>
                      <td className="p-3 text-stone-600">
                        {new Date(pay.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-medium text-stone-900">{pay.method}</td>
                      <td className="p-3 text-stone-600">{pay.notes || '—'}</td>
                      <td className="p-3 text-right font-mono font-bold text-green-700">
                        Rs. {Number(pay.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showPayForm && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setShowPayForm(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900">Record Payment</h2>
              <button
                type="button"
                onClick={() => setShowPayForm(false)}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {payError && <ErrorAlert message={payError} onClose={() => setPayError(null)} />}

              <div>
                <label className="font-bold text-stone-700 text-xs block mb-2">
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 text-xs block mb-2">
                  Payment Method
                </label>
                <div className="w-full px-3 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-900">
                  {invoice.paymentMethod || 'Cash on Delivery'}
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  Method is taken from the original order and cannot be changed here.
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-700 text-xs block mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleRecordPayment}
                disabled={saving}
                className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
