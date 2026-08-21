import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import { User } from '../../types/auth';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Users, Shield, RefreshCw, UserCheck, UserX, Ban, AlertTriangle } from 'lucide-react';

type ConfirmAction = {
  type: 'deactivate' | 'reactivate' | 'revoke-wholesale';
  user: User;
} | null;

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [acting, setActing] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/admin/users');
      setUsers(res.data.data.users || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Users list endpoint is restricted or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = async (user: User) => {
    try {
      setActing(user._id);
      setError(null);
      await adminService.deactivateUser(user._id);
      setSuccess(`User ${user.name} (${user.email}) has been deactivated. They can no longer sign in.`);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to deactivate user.');
    } finally {
      setActing(null);
      setConfirmAction(null);
    }
  };

  const handleReactivate = async (user: User) => {
    try {
      setActing(user._id);
      setError(null);
      await adminService.reactivateUser(user._id);
      setSuccess(`User ${user.name} (${user.email}) has been reactivated.`);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reactivate user.');
    } finally {
      setActing(null);
      setConfirmAction(null);
    }
  };

  const handleRevokeWholesale = async (user: User) => {
    try {
      setActing(user._id);
      setError(null);
      await adminService.revokeWholesale(user._id);
      setSuccess(`Wholesale privileges revoked for ${user.name} (${user.email}). Their account remains active as a customer.`);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to revoke wholesale privileges.');
    } finally {
      setActing(null);
      setConfirmAction(null);
    }
  };

  const confirmMessage = (action: ConfirmAction): { title: string; description: string } => {
    if (!action) return { title: '', description: '' };

    switch (action.type) {
      case 'deactivate':
        return {
          title: 'Deactivate User Account',
          description: `Are you sure you want to deactivate ${action.user.name} (${action.user.email})? They will no longer be able to sign in. Their orders, invoices, and records are preserved.`,
        };
      case 'reactivate':
        return {
          title: 'Reactivate User Account',
          description: `Reactivate ${action.user.name} (${action.user.email})? They will be able to sign in again.`,
        };
      case 'revoke-wholesale':
        return {
          title: 'Revoke Wholesale Privileges',
          description: `Revoke wholesale access for ${action.user.name} (${action.user.email})? Their role will change to customer. Their orders, invoices, and wholesale profile are preserved. Their account stays active.`,
        };
    }
  };

  const confirm = confirmMessage(confirmAction);

  const performConfirmedAction = async () => {
    if (!confirmAction) return;

    const { type, user } = confirmAction;

    if (type === 'deactivate') {
      await handleDeactivate(user);
    } else if (type === 'reactivate') {
      await handleReactivate(user);
    } else if (type === 'revoke-wholesale') {
      await handleRevokeWholesale(user);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
            <Users className="w-4 h-4" />
            <span>Account Management</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Registered Store Users
          </h1>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Fetching registered users..." />
      ) : users.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center text-xs text-stone-500">
          No user accounts found.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Wholesale Status</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-stone-900">{u.name}</td>
                    <td className="p-3 text-stone-600 font-mono">{u.email}</td>
                    <td className="p-3 text-stone-600 font-mono">{u.phone || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-stone-100 text-stone-800 border border-stone-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        u.wholesaleStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        u.wholesaleStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {u.wholesaleStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        u.isActive === false ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.isActive === false ? (
                          <>
                            <UserX className="w-3 h-3" />
                            <span>Inactive</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.isActive === false ? (
                          <button
                            type="button"
                            disabled={acting === u._id}
                            onClick={() => setConfirmAction({ type: 'reactivate', user: u })}
                            className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 disabled:opacity-50"
                            title="Reactivate this user account"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Reactivate</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={acting === u._id}
                              onClick={() => setConfirmAction({ type: 'deactivate', user: u })}
                              className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 disabled:opacity-50"
                              title="Deactivate this user account. They will no longer be able to sign in."
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Deactivate</span>
                            </button>

                            {u.role === 'wholesale' && u.wholesaleStatus === 'approved' && (
                              <button
                                type="button"
                                disabled={acting === u._id}
                                onClick={() => setConfirmAction({ type: 'revoke-wholesale', user: u })}
                                className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 disabled:opacity-50"
                                title="Revoke wholesale privileges. The account stays active as a customer."
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Revoke Wholesale</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {confirmAction && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setConfirmAction(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100 bg-amber-50">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-stone-900">{confirm.title}</h2>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-stone-700 leading-relaxed">
                {confirm.description}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  disabled={acting !== null}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={performConfirmedAction}
                  disabled={acting !== null}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition disabled:opacity-50 ${
                    confirmAction.type === 'deactivate' ? 'bg-red-700 hover:bg-red-800' :
                    confirmAction.type === 'reactivate' ? 'bg-emerald-700 hover:bg-emerald-800' :
                    'bg-amber-700 hover:bg-amber-800'
                  }`}
                >
                  {acting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
