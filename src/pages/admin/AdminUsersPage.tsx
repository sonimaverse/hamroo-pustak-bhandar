import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import { User } from '../../types/auth';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Users, Shield, RefreshCw } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/admin/users');
      setUsers(res.data.data.users || []);
    } catch (err: any) {
      // If endpoint not fully exposed, fallback gracefully
      setError(err.response?.data?.message || 'Users list endpoint is restricted or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
                        u.wholesaleStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {u.wholesaleStatus}
                      </span>
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
