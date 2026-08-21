import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { BookOpen, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Reset Password | Hamro Pustak Bhandar';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await authService.resetPassword(token, password, confirmPassword);

      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 shadow-2xs space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Invalid Reset Link</h1>
        <p className="text-xs text-stone-500">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition"
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 shadow-2xs space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Password Reset Successful</h1>
        <p className="text-xs text-stone-500">
          Your password has been changed. You can now sign in with your new password.
        </p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          Continue to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 shadow-2xs space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center mx-auto shadow-xs">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Reset Your Password</h1>
        <p className="text-xs text-stone-500 font-medium">
          Enter your new password below.
        </p>
      </div>

      <ErrorAlert message={error || ''} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span>Resetting...</span>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Reset Password</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-4 border-t border-stone-100 text-xs text-stone-500">
        <Link to="/login" className="inline-flex items-center gap-1 font-bold text-stone-600 hover:text-stone-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};
