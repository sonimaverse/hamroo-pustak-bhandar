import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Shield, Briefcase, Package, ArrowRight, CheckCircle, Clock, Edit2, Save, X, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import { ErrorAlert } from '../components/common/ErrorAlert';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'My Profile | Hamro Pustak Bhandar';
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setStreet(user.address?.street || '');
      setCity(user.address?.city || '');
      setState(user.address?.state || '');
      setPostalCode(user.address?.postalCode || '');
    }
  }, [user]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await updateProfile({
        name,
        phone,
        address: {
          street,
          city,
          state,
          postalCode,
          country: 'Nepal',
        },
      });
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from the current password.');
      return;
    }

    try {
      setPasswordSaving(true);
      await changePassword({ currentPassword, password: newPassword, confirmPassword: confirmNewPassword });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowPasswordFields(false);
      setShowChangePassword(false);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Profile Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-red-700 text-white flex items-center justify-center text-2xl font-bold font-serif shadow-xs shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-serif font-bold text-stone-900">{user.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200">
              {user.role}
            </span>
          </div>

          <p className="text-xs text-stone-500 font-medium">{user.email}</p>

          <div className="pt-2 flex flex-wrap gap-4 justify-center sm:justify-start text-xs font-medium">
            <div className="flex items-center gap-1 text-stone-600">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>{user.phone || 'No phone recorded'}</span>
            </div>
            <div className="flex items-center gap-1 text-stone-600">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="capitalize">Wholesale Status: {user.wholesaleStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            {editing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4 text-red-700" />}
            <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
          <Link
            to="/orders"
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Orders</span>
          </Link>
        </div>
      </div>

      {/* Profile Edit Form */}
      {editing && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-serif font-bold text-stone-900">Edit Profile Details</h2>
            <span className="text-[10px] text-stone-400 font-bold uppercase">Role & Wholesale Status Managed By System</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Mobile Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900"
                placeholder="+977-9841234567"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Street / Locality</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                placeholder="e.g. New Baneshwor"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                placeholder="e.g. Kathmandu"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Province / State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                placeholder="e.g. Bagmati"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900"
                placeholder="e.g. 44600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid: Account Actions & Wholesale Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Wholesale Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Briefcase className="w-5 h-5 text-amber-800" />
            <h2 className="text-base font-serif font-bold text-stone-900">Wholesale Account Portal</h2>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Bulk book buyers, bookstores, and educational institutions enjoy tier-based wholesale pricing across all Nepal publications.
          </p>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs flex items-center justify-between">
            <span className="font-bold text-stone-700">Current Wholesale Access:</span>
            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
              user.wholesaleStatus === 'approved'
                ? 'bg-emerald-100 text-emerald-800'
                : user.wholesaleStatus === 'pending'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-stone-200 text-stone-700'
            }`}>
              {user.wholesaleStatus}
            </span>
          </div>

          <div>
            {user.wholesaleStatus === 'approved' ? (
              <Link
                to="/wholesale/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-950 transition"
              >
                <span>Access Wholesale Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : user.wholesaleStatus === 'pending' ? (
              <Link
                to="/wholesale/status"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-200 transition"
              >
                <Clock className="w-4 h-4" />
                <span>Check Application Review Status</span>
              </Link>
            ) : (
              <Link
                to="/wholesale"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-red-800 transition"
              >
                <span>Apply for Wholesale Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Security & Quick Info */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Shield className="w-5 h-5 text-red-700" />
            <h2 className="text-base font-serif font-bold text-stone-900">Security & Account Details</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
              <span className="font-bold text-stone-700">Email Address:</span>
              <span className="font-medium text-stone-900">{user.email}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
              <span className="font-bold text-stone-700">Account Type (Role):</span>
              <span className="font-mono text-stone-900 uppercase font-semibold">{user.role}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
              <span className="font-bold text-stone-700">Session Status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Verified Token
              </span>
            </div>

            {!showChangePassword && (
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(true);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
                className="w-full px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Change Password</span>
              </button>
            )}

            {showChangePassword && (
              <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                {passwordError && (
                  <ErrorAlert message={passwordError} onClose={() => setPasswordError(null)} />
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-stone-700 mb-1 text-[11px]">Current Password</label>
                  <input
                    type={showPasswordFields ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1 text-[11px]">New Password</label>
                  <input
                    type={showPasswordFields ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1 text-[11px]">Confirm New Password</label>
                  <input
                    type={showPasswordFields ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 text-[11px] text-stone-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPasswordFields}
                    onChange={(e) => setShowPasswordFields(e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  Show passwords
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                      setPasswordError(null);
                      setPasswordSuccess(null);
                    }}
                    className="flex-1 px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {passwordSaving ? 'Saving...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
