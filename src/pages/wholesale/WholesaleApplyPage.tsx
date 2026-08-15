import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { wholesaleService } from '../../services/wholesaleService';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Briefcase, Building2, FileText, Phone, User as UserIcon, CheckCircle2, Mail, Lock } from 'lucide-react';

export const WholesaleApplyPage: React.FC = () => {
  const { user, register, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [companyName, setCompanyName] = useState('Valley Book Distributors');
  const [panVatNumber, setPanVatNumber] = useState('600123456');
  const [businessType, setBusinessType] = useState('Bookstore Chain');
  const [contactPerson, setContactPerson] = useState(user?.name || 'Hari Bahadur');
  const [phone, setPhone] = useState(user?.phone || '+977-1-4223344');
  const [street, setStreet] = useState('New Road');
  const [city, setCity] = useState('Kathmandu');
  const [state, setState] = useState('Bagmati');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Apply for Wholesale | Hamro Pustak Bhandar';
    if (user?.wholesaleStatus === 'approved') {
      navigate('/wholesale/dashboard');
    } else if (user?.wholesaleStatus === 'pending') {
      navigate('/wholesale/status');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !panVatNumber || !contactPerson || !phone) {
      setError('Please fill in all mandatory business application fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Register if unauthenticated
      if (!user) {
        if (!email || !password) {
          setError('Please provide an email and password to create your merchant account.');
          setLoading(false);
          return;
        }
        await register({
          name: contactPerson,
          email,
          password,
          phone,
        });
      }

      const formData = new FormData();
      formData.append('companyName', companyName);
      formData.append('panVatNumber', panVatNumber);
      formData.append('businessType', businessType);
      formData.append('contactPerson', contactPerson);
      formData.append('phone', phone);
      formData.append('businessPhone', phone);
      formData.append('street', street);
      formData.append('city', city);
      formData.append('state', state);

      await wholesaleService.applyForWholesale(formData);
      if (refreshUser) {
        await refreshUser();
      }
      navigate('/wholesale/status');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit wholesale application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
          <Briefcase className="w-4 h-4" />
          <span>B2B & Institutional Partner Program</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Apply for Wholesale Tier Rates
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          Bookstores, school libraries, and bulk buyers across Nepal enjoy special bulk rates and direct publisher inventory access.
        </p>
      </div>

      <ErrorAlert message={error || ''} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4 text-xs">
        
        {!user && (
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-3 mb-2">
            <p className="font-bold text-[#0F1E3D] text-xs">Account Credentials (for your merchant account)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="merchant@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Create Account Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Registered Company / Institution Name *</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Valley Book Distributors"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">PAN / VAT Reg. Number *</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={panVatNumber}
                onChange={(e) => setPanVatNumber(e.target.value)}
                placeholder="600123456"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Business Type *</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
            >
              <option value="Bookstore Chain">Bookstore Chain</option>
              <option value="Independent Retailer">Independent Retailer</option>
              <option value="Educational Institution">Educational Institution / School</option>
              <option value="Library">Public / Private Library</option>
              <option value="Distributor">Regional Distributor</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Primary Contact Person *</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Hari Bahadur"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Contact Phone *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977-1-4223344"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="New Road"
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Kathmandu"
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">State / Province</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Bagmati"
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Wholesale Application</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
