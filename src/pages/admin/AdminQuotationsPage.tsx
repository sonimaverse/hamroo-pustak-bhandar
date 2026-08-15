import React, { useState, useEffect } from 'react';
import { quotationService, QuotationRecord } from '../../services/quotationService';
import { FileText, Building2, Calendar, CheckCircle2, DollarSign, Download, ExternalLink } from 'lucide-react';

export function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const data = await quotationService.getAllQuotations();
      setQuotations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch quotations:', err);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F1E3D]">Issued Quotations & Rate Sheets</h1>
        <p className="text-xs text-stone-500 mt-1">
          Track official institutional quotations issued to schools, colleges, and corporate partners.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-500">Loading quotations...</div>
        ) : quotations.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">No issued quotations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Quote #</th>
                  <th className="px-4 py-3">Organization / Client</th>
                  <th className="px-4 py-3">Grand Total</th>
                  <th className="px-4 py-3">Valid Until</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {quotations.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50/80 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-[#0F1E3D]">
                      {item.quotationNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-stone-900">{item.organizationName}</div>
                      <div className="text-[11px] text-stone-500">{item.clientName} ({item.clientPhone})</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">
                      NPR {item.grandTotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-stone-600">
                      {new Date(item.validUntil).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => alert(`Official Quotation PDF for ${item.quotationNumber}\nClient: ${item.organizationName}\nTotal: NPR ${item.grandTotal}`)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
