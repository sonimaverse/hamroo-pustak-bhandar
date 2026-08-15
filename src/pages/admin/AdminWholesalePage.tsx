import React, { useEffect, useState } from 'react';
import { WholesaleApplication } from '../../types/wholesale';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Briefcase, CheckCircle2, XCircle, RefreshCw, Building2, Phone, FileText } from 'lucide-react';

export const AdminWholesalePage: React.FC = () => {
  const [applications, setApplications] = useState<WholesaleApplication[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getWholesaleApplications(filterStatus);
      setApplications(Array.isArray(data?.applications) ? data.applications : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch wholesale applications.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [filterStatus]);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveWholesaleApplication(id);
      fetchApps();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve application.');
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason) return;
    try {
      await adminService.rejectWholesaleApplication(id, rejectionReason);
      setRejectingId(null);
      setRejectionReason('');
      fetchApps();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject application.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <Briefcase className="w-4 h-4" />
            <span>B2B Partner Verification</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Wholesale Applications ({applications.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={fetchApps}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner label="Fetching wholesale partner applications..." />
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center text-xs text-stone-500">
          No wholesale applications matching the current filter.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm">{app.companyName}</h3>
                  <span className="text-stone-400 text-[11px] font-mono">PAN/VAT: {app.panVatNumber}</span>
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                  app.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : app.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {app.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700 font-medium">
                <div>
                  <span className="text-stone-400 block font-semibold">Contact Person</span>
                  <span>{app.contactPerson} ({app.phone})</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Business Type</span>
                  <span>{app.businessType}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Location</span>
                  <span>{app.address?.city || 'N/A'}, {app.address?.state || 'N/A'}</span>
                </div>
              </div>

              {/* Actions */}
              {app.status === 'pending' && (
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-end gap-2 text-xs">
                  {rejectingId === app._id ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs flex-1"
                      />
                      <button
                        onClick={() => handleReject(app._id)}
                        className="px-3 py-1.5 bg-red-700 text-white rounded-xl font-bold"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => setRejectingId(null)}
                        className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setRejectingId(app._id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Partner
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
