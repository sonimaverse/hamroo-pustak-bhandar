import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../../services/invoiceService';
import { Invoice } from '../../types/invoice';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { FileText, Eye, Receipt, CheckCircle2, Clock3, AlertCircle } from 'lucide-react';

export const AdminBillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getAllInvoices();
      setInvoices(Array.isArray(data?.invoices) ? data.invoices : []);
    } catch (err: any) {
      console.error('Failed to fetch invoices:', err);
      setError(err?.response?.data?.message || 'Failed to fetch invoices.');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Paid
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold uppercase">
            <Clock3 className="w-3.5 h-3.5" />
            Partial
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold uppercase">
            <AlertCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 text-[11px] font-bold uppercase">
            <Clock3 className="w-3.5 h-3.5" />
            Due
          </span>
        );
    }
  };

  const totalInvoiced = invoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const totalPaid = invoices.reduce((sum, i) => sum + (Number(i.paidAmount) || 0), 0);
  const totalDue = invoices.reduce((sum, i) => sum + (Number(i.dueAmount) || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
              <Receipt className="w-4 h-4" />
              <span>Billing & Invoices</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Invoice Management
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Generate invoices from orders and record customer payments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4">
            <p className="text-[10px] uppercase font-bold text-stone-400">Total Invoiced</p>
            <p className="text-xl font-bold text-stone-900 mt-1">Rs. {totalInvoiced.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
            <p className="text-[10px] uppercase font-bold text-green-600">Total Paid</p>
            <p className="text-xl font-bold text-green-800 mt-1">Rs. {totalPaid.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-[10px] uppercase font-bold text-yellow-600">Total Due</p>
            <p className="text-xl font-bold text-yellow-800 mt-1">Rs. {totalDue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner label="Fetching invoices..." />
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center">
          <FileText className="w-10 h-10 mx-auto text-stone-300" />
          <h3 className="font-bold text-stone-800 mt-3">No invoices yet</h3>
          <p className="text-xs text-stone-500 mt-1">
            Generate an invoice from the Orders page to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Invoice #</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-stone-50/80 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-stone-900">
                      {inv.invoiceNumber}
                    </td>
                     <td className="px-4 py-3.5 font-mono text-stone-600">
                       {inv.orderId
                         ? (typeof inv.orderId === 'object' ? inv.orderId._id : inv.orderId)
                         : '—'}
                     </td>
                    <td className="px-4 py-3.5 text-stone-600">
                      {new Date(inv.invoiceDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-stone-900">
                      Rs. {Number(inv.total).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-green-700">
                      Rs. {Number(inv.paidAmount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-yellow-700">
                      Rs. {Number(inv.dueAmount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(inv.status)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => navigate(`/admin/invoices/${inv._id}`)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
