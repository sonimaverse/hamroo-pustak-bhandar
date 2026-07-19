import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type InstitutionType = 'college' | 'school' | 'institution' | 'office' | 'stationery' | 'other';

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    institutionType: '' as InstitutionType | '',
    institutionName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    products: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        institutionType: '',
        institutionName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        products: '',
        message: '',
      });
      onClose();
    }, 2000);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-card">
        <div className="sticky top-0 flex items-center justify-between border-b border-brown-100 bg-white px-6 py-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-brown-800">Institutional Enquiry</h3>
            <p className="text-xs text-brown-500">Get custom quotations for your organization</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-brown-200 text-brown-500 transition hover:bg-brown-50 hover:text-brown-700"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Send size={28} />
            </div>
            <p className="mt-4 font-serif text-xl font-bold text-brown-800">Enquiry Submitted!</p>
            <p className="mt-2 text-sm text-brown-500">
              Thank you for your interest. Our team will get back to you with a customized quotation shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wide text-brown-700">
                Institution Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.institutionType}
                onChange={(e) => updateField('institutionType', e.target.value)}
                className="w-full rounded-lg border border-brown-200 bg-cream-50 px-4 py-2.5 text-sm text-brown-700 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
              >
                <option value="">Select institution type</option>
                <option value="college">College</option>
                <option value="school">School</option>
                <option value="institution">Institution</option>
                <option value="office">Office</option>
                <option value="stationery">Other Stationery</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wide text-brown-700">
                Institution / Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.institutionName}
                onChange={(e) => updateField('institutionName', e.target.value)}
                placeholder="e.g. Kathmandu College of Management"
                className="w-full rounded-lg border border-brown-200 bg-cream-50 px-4 py-2.5 text-sm text-brown-700 outline-none transition placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wide text-brown-700">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => updateField('contactPerson', e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-brown-200 bg-cream-50 px-4 py-2.5 text-sm text-brown-700 outline-none transition placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wide text-brown-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+977 98xxxxxxxx"
                  className="w-full rounded-lg border border-brown-200 bg-cream-50 px-4 py-2.5 text-sm text-brown-700 outline-none transition placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wide text-brown-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="procurement@institution.edu.np"
                className="w-full rounded-lg border border-brown-200 bg-cream-50 px-4 py-2.5 text-sm text-brown-700 outline-none transition placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wide text-brown-700">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Full delivery address"
                rows={2}
                className="w-full rounded-lg border border-brown-200 bg-cream-50 px-4 py-2.5 text-sm text-brown-700 outline-none transition placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wide text-brown-700">
                Products Interested In
              </label>
              <textarea
                value={formData.products}
                onChange={(e) => updateField('products', e.target.value)}
                placeholder="e.g. SEE Mathematics, SEE Physics Guide, Stationery items..."
                rows={2}
                className="w-full rounded-lg border border-brown-200 bg-cream-50 px-4 py-2.5 text-sm text-brown-700 outline-none transition placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wide text-brown-700">
                Additional Requirements
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Any specific requirements, quantities, or delivery timeline..."
                rows={3}
                className="w-full rounded-lg border border-brown-200 bg-cream-50 px-4 py-2.5 text-sm text-brown-700 outline-none transition placeholder:text-brown-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brown-700 px-6 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-brown-800"
            >
              <Send size={16} />
              SUBMIT ENQUIRY
            </button>
          </form>
        )}
      </div>
    </div>
  );
}