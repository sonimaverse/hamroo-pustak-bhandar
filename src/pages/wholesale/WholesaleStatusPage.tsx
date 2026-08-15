import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wholesaleService } from '../../services/wholesaleService';
import { WholesaleStatus } from '../../types/wholesale';
import { WholesaleNav } from '../../components/wholesale/WholesaleNav';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Briefcase, Clock, CheckCircle2, XCircle, ArrowRight, RefreshCw, FileText, Phone, Building2 } from 'lucide-react';

export const WholesaleStatusPage: React.FC = () => {
  const [status, setStatus] = useState<WholesaleStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wholesaleService.getMyWholesaleStatus();
      setStatus(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch wholesale status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Wholesale Application Status | Hamro Pustak Bhandar';
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="py-16 max-w-2xl mx-auto">
        <LoadingSpinner label="Checking wholesale application status..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {status?.status === 'approved' && <WholesaleNav />}

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <Briefcase className="w-4 h-4" />
            <span>Verification Status</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Wholesale Review Status
          </h1>
        </div>

        <button
          onClick={fetchStatus}
          className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
          title="Refresh Status"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {status?.status === 'approved' ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-2xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900">Wholesale Account Approved!</h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Your application for <strong className="text-stone-900">{status.application?.companyName}</strong> has been approved. You now have access to tier-based wholesale pricing across all titles.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/wholesale/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <span>Wholesale Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/wholesale/books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs rounded-xl transition"
            >
              <span>Bulk Catalog</span>
            </Link>
          </div>
        </div>
      ) : status?.status === 'pending' ? (
        <div className="bg-white rounded-3xl border border-amber-200 p-8 shadow-2xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900">Application Under Review</h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Your wholesale application for <strong className="text-stone-900">{status.application?.companyName}</strong> (PAN/VAT: {status.application?.panVatNumber}) is currently being reviewed by our administration team.
          </p>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 max-w-md mx-auto space-y-2">
            <p className="font-bold text-stone-800">Review Timeline: 1 Business Day</p>
            <p>We verify tax documentation and business locations. For immediate inquiries, contact our Kathmandu desk at <strong>+977-1-4223344</strong>.</p>
          </div>
        </div>
      ) : status?.status === 'rejected' ? (
        <div className="bg-white rounded-3xl border border-red-200 p-8 shadow-2xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-800 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900">Application Not Approved</h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Regrettably, your wholesale partner application was not approved at this time.
          </p>

          {status.application?.rejectionReason && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 font-medium max-w-md mx-auto">
              <strong>Reason:</strong> {status.application.rejectionReason}
            </div>
          )}

          <div className="pt-2">
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl transition"
            >
              <span>Re-apply for Wholesale</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-2xs text-center space-y-4">
          <FileText className="w-12 h-12 text-stone-400 mx-auto stroke-1" />
          <h2 className="text-lg font-serif font-bold text-stone-900">No Application Found</h2>
          <p className="text-xs text-stone-500">You have not submitted a wholesale account application yet.</p>
          <Link
            to="/wholesale"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
};
