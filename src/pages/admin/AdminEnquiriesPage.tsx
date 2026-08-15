import React, { useState, useEffect } from 'react';
import { enquiryService, EnquiryItem } from '../../services/enquiryService';
import { quotationService } from '../../services/quotationService';
import { Building2, School, Search, Filter, CheckCircle, Clock, FileText, Send, X, AlertCircle } from 'lucide-react';

export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  
  // Quotation Generator Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteItems, setQuoteItems] = useState([
    { title: 'Class 10 Textbooks Set', quantity: 50, unitPrice: 1200, total: 60000 },
  ]);
  const [quoteDiscount, setQuoteDiscount] = useState(5000);
  const [quoteNotes, setQuoteNotes] = useState('Includes 5% bulk educational discount and free Kathmandu valley delivery.');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const data = await enquiryService.getAllEnquiries(statusFilter);
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: 'pending' | 'quoted' | 'closed') => {
    try {
      await enquiryService.updateEnquiryStatus(id, status);
      fetchEnquiries();
      if (selectedEnquiry?._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const calculateSubtotal = () => quoteItems.reduce((acc, item) => acc + item.total, 0);
  const calculateGrandTotal = () => Math.max(0, calculateSubtotal() - quoteDiscount);

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setQuoteSubmitting(true);
    setQuoteSuccess('');

    try {
      const validUntilDate = new Date();
      validUntilDate.setDate(validUntilDate.getDate() + 30); // Valid for 30 days

      await quotationService.createQuotation({
        enquiryId: selectedEnquiry._id,
        clientName: selectedEnquiry.contactPerson,
        clientEmail: selectedEnquiry.email,
        clientPhone: selectedEnquiry.phone,
        organizationName: selectedEnquiry.organizationName,
        items: quoteItems,
        subtotal: calculateSubtotal(),
        discount: quoteDiscount,
        grandTotal: calculateGrandTotal(),
        notes: quoteNotes,
        validUntil: validUntilDate.toISOString(),
      });

      // Mark enquiry status as quoted
      await enquiryService.updateEnquiryStatus(selectedEnquiry._id, 'quoted');
      setQuoteSuccess('Quotation generated and sent successfully!');
      fetchEnquiries();
      setTimeout(() => {
        setShowQuoteModal(false);
        setQuoteSuccess('');
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate quotation.');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3D]">Institutional Enquiries & RFQs</h1>
          <p className="text-xs text-stone-500 mt-1">
            Review quotation requests submitted by schools, colleges, institutions, and stationery buyers.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
          {['all', 'pending', 'quoted', 'closed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                statusFilter === filter
                  ? 'bg-white text-[#0F1E3D] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiry List */}
        <div className="lg:col-span-7 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200">
              Loading enquiries...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200">
              No enquiries found for status "{statusFilter}".
            </div>
          ) : (
            enquiries.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedEnquiry(item)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedEnquiry?._id === item._id
                    ? 'border-[#0F1E3D] bg-blue-50/40 ring-1 ring-[#0F1E3D]'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold uppercase mb-1">
                      {item.organizationType}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900">{item.organizationName}</h3>
                    <p className="text-xs text-stone-600">Contact: {item.contactPerson} ({item.phone})</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      item.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'quoted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Est. Qty: <strong>{item.estimatedQuantity || 1} units</strong></span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enquiry Detail Panel */}
        <div className="lg:col-span-5">
          {selectedEnquiry ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5 sticky top-20">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Enquiry Details</span>
                <span className="text-xs text-stone-400">ID: {selectedEnquiry._id.slice(-6)}</span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#0F1E3D]">{selectedEnquiry.organizationName}</h2>
                <p className="text-xs text-stone-500">{selectedEnquiry.organizationType} • {selectedEnquiry.address}</p>
              </div>

              <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-1.5">
                <p><strong>Contact Person:</strong> {selectedEnquiry.contactPerson}</p>
                <p><strong>Email:</strong> {selectedEnquiry.email}</p>
                <p><strong>Phone:</strong> {selectedEnquiry.phone}</p>
                <p><strong>Estimated Volume:</strong> {selectedEnquiry.estimatedQuantity} items</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-700 mb-1">Requirement List:</h4>
                <div className="bg-stone-900 text-amber-100 p-3.5 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedEnquiry.requirements}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full py-2.5 bg-[#0F1E3D] hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Official Quotation</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry._id, 'quoted')}
                    className="py-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl transition"
                  >
                    Mark as Quoted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry._id, 'closed')}
                    className="py-2 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl transition"
                  >
                    Close Enquiry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-2xl border border-dashed border-stone-300 p-8 text-center text-xs text-stone-500">
              Select an enquiry from the list to view requirements and generate a quotation.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Generate Quotation */}
      {showQuoteModal && selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#0F1E3D]">Generate Quotation for {selectedEnquiry.organizationName}</h3>
              <button onClick={() => setShowQuoteModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-200 font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{quoteSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-stone-800 mb-2">Quotation Line Items</h4>
                {quoteItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <input
                      type="text"
                      placeholder="Item Title"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...quoteItems];
                        newItems[idx].title = e.target.value;
                        setQuoteItems(newItems);
                      }}
                      className="col-span-6 px-3 py-1.5 border rounded-lg"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...quoteItems];
                        const qty = parseInt(e.target.value) || 0;
                        newItems[idx].quantity = qty;
                        newItems[idx].total = qty * newItems[idx].unitPrice;
                        setQuoteItems(newItems);
                      }}
                      className="col-span-2 px-2 py-1.5 border rounded-lg text-center"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Rate (NPR)"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const newItems = [...quoteItems];
                        const rate = parseFloat(e.target.value) || 0;
                        newItems[idx].unitPrice = rate;
                        newItems[idx].total = newItems[idx].quantity * rate;
                        setQuoteItems(newItems);
                      }}
                      className="col-span-3 px-2 py-1.5 border rounded-lg text-right font-mono"
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setQuoteItems([...quoteItems, { title: 'Secondary Item / Stationery', quantity: 10, unitPrice: 150, total: 1500 }])}
                  className="text-blue-700 font-bold text-[11px] underline mt-1"
                >
                  + Add Line Item
                </button>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Subtotal:</span>
                  <span className="font-mono text-sm">NPR {calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Discount / Subsidy (NPR):</span>
                  <input
                    type="number"
                    value={quoteDiscount}
                    onChange={(e) => setQuoteDiscount(parseFloat(e.target.value) || 0)}
                    className="w-28 px-2 py-1 border rounded-lg text-right font-mono"
                  />
                </div>
                <div className="flex justify-between items-center font-extrabold text-sm border-t pt-2 text-[#0F1E3D]">
                  <span>Grand Total:</span>
                  <span className="font-mono text-base">NPR {calculateGrandTotal().toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Quotation Notes / Terms</label>
                <textarea
                  rows={2}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2 border rounded-xl text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quoteSubmitting}
                  className="px-6 py-2 bg-[#0F1E3D] text-white font-bold rounded-xl hover:bg-blue-900 transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Issue & Send Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
