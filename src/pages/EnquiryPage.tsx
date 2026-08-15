import React, { useState } from 'react';
import { Building2, School, GraduationCap, Briefcase, Store, HelpCircle, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { enquiryService } from '../services/enquiryService';

export function EnquiryPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'School' as 'College' | 'School' | 'Institution' | 'Office' | 'Stationery' | 'Other',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    requirements: '',
    estimatedQuantity: '50',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const orgTypes = [
    { type: 'School', label: 'School (Grade 1-12)', icon: School, desc: 'School curriculum & textbooks' },
    { type: 'College', label: 'College / University', icon: GraduationCap, desc: 'Higher education & technical books' },
    { type: 'Institution', label: 'Training Institution', icon: Building2, desc: 'Coaching & reference materials' },
    { type: 'Office', label: 'Corporate / Office', icon: Briefcase, desc: 'Office stationery & supplies' },
    { type: 'Stationery', label: 'Stationery Retailer', icon: Store, desc: 'Bulk stationery resale' },
    { type: 'Other', label: 'Other Organization', icon: HelpCircle, desc: 'Custom bulk requirement' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await enquiryService.submitEnquiry({
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        requirements: formData.requirements,
        estimatedQuantity: parseInt(formData.estimatedQuantity) || 1,
      });

      setSuccess(true);
      setFormData({
        organizationName: '',
        organizationType: 'School',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        requirements: '',
        estimatedQuantity: '50',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Institutional Sales & Bulk Supply
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F1E3D] tracking-tight">
            Institutional Quotation Request
          </h1>
          <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
            Are you a school, college, corporate office, or stationery retailer? Submit your requirement list below to receive a customized wholesale quotation from <strong className="text-[#0F1E3D]">Hamro Pustak Bhandar</strong>.
          </p>
        </div>

        {success && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-900 shadow-sm">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold">Enquiry Submitted Successfully!</h3>
                <p className="text-sm text-emerald-800 mt-1">
                  Thank you for contacting Hamro Pustak Bhandar. Our institutional sales team is reviewing your requirements and will reach out with a detailed rate quotation within 24 business hours.
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg transition"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Organization Type */}
            <div>
              <label className="block text-sm font-bold text-[#0F1E3D] mb-3">
                1. Select Organization Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {orgTypes.map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.organizationType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setFormData({ ...formData, organizationType: item.type as any })}
                      className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition ${
                        isSelected
                          ? 'border-[#0F1E3D] bg-blue-50/50 ring-2 ring-[#0F1E3D]/10'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mb-2 ${isSelected ? 'bg-[#0F1E3D] text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-stone-900">{item.label}</span>
                      <span className="text-xs text-stone-500 mt-0.5 line-clamp-1">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Organization Details */}
            <div>
              <h3 className="text-sm font-bold text-[#0F1E3D] mb-4 border-b pb-2">
                2. Organization & Contact Person Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Organization / School Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Xavier's School / Apex College"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1E3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Adhikari"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1E3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. info@school.edu.np"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1E3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +977 9801234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1E3D]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Address / Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jawalakhel, Lalitpur, Bagmati"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1E3D]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Requirement Specification */}
            <div>
              <h3 className="text-sm font-bold text-[#0F1E3D] mb-4 border-b pb-2">
                3. Book & Stationery Requirements
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Estimated Total Quantity (Copies / Units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="50"
                    value={formData.estimatedQuantity}
                    onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    className="w-full sm:w-48 px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1E3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Detailed List of Books / Curriculum / Supplies Needed *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Example:
- Class 10 Science & Math Books (CDC Syllabus) - 50 sets
- Class 11 Physics & Chemistry Reference Books - 30 sets
- A4 Notebooks & Examination Answer Sheets - 200 copies"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1E3D] font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-[#0F1E3D] hover:bg-blue-900 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Quotation Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
