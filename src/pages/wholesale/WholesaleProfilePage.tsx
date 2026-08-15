import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { wholesaleService } from '../../services/wholesaleService';
import { WholesaleApplication } from '../../types/wholesale';
import { WholesaleNav } from '../../components/wholesale/WholesaleNav';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Building2, ShieldCheck, Mail, Phone, FileText, MapPin, CheckCircle, Clock, ExternalLink, User } from 'lucide-react';

export const WholesaleProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState<WholesaleApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Wholesale Business Profile | Hamro Pustak Bhandar';
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await wholesaleService.getMyWholesaleStatus();
        setApplication(data.application);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch business profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <WholesaleNav />

      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <Building2 className="w-4 h-4" />
            <span>Institutional Partner Account</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Wholesale Business Profile
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified company registration credentials for wholesale tax invoices and trade billing.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Status: {user?.wholesaleStatus?.toUpperCase() || 'APPROVED'}</span>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner label="Loading business credentials..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Business Details */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  {application?.companyName || user?.name || 'Registered Entity'}
                </h2>
                <p className="text-xs text-stone-500 capitalize">
                  Business Entity Type: {application?.businessType || 'Retailer / Distributor'}
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-mono font-bold text-xs rounded-lg">
                PAN/VAT: {application?.panVatNumber || 'N/A'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-400">Primary Contact Person</span>
                <p className="font-bold text-stone-900">{application?.contactPerson || user?.name}</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-400">Business Phone</span>
                <p className="font-bold text-stone-900">{application?.businessPhone || user?.phone || 'Not recorded'}</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  Registered Business Address
                </span>
                <p className="font-bold text-stone-900">
                  {application?.businessAddress
                    ? `${application.businessAddress.street}, ${application.businessAddress.city}, ${application.businessAddress.state}`
                    : user?.address
                    ? `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''}`
                    : 'Address on file'}
                </p>
              </div>
            </div>

            {application?.documentUrl && (
              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-900" />
                  <span className="font-bold text-stone-900">Tax License Document</span>
                </div>
                <a
                  href={application.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-900 font-bold hover:underline flex items-center gap-1"
                >
                  <span>View Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="text-[11px] text-stone-400 italic">
              * Official PAN / VAT company details are verified by Kathmandu Sales Administration. To request changes to registered business details, contact <strong>wholesale@hamropustak.com</strong>.
            </div>

          </div>

          {/* Account Credentials Card */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <User className="w-4 h-4 text-amber-900" />
                <h3 className="font-serif font-bold text-stone-900 text-sm">Account Manager</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400">Account Name</span>
                  <p className="font-medium text-stone-900">{user?.name}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400">Login Email</span>
                  <p className="font-medium text-stone-900">{user?.email}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400">System Role</span>
                  <p className="font-mono text-stone-900 uppercase font-bold">{user?.role}</p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase text-stone-400">Application Date</span>
                  <p className="text-stone-600 font-medium">
                    {application?.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Active Partner'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
