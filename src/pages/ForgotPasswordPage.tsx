import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { BookOpen, Mail, ArrowLeft, KeyRound } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await authService.forgotPassword(email.trim());

      setSubmitted(true);

      if (result.resetToken) {
        setDevToken(result.resetToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 shadow-2xs space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Forgot Password</h1>
        <p className="text-xs text-stone-500 font-medium">
          Enter your email address and we will send you instructions to reset your password.
        </p>
      </div>

      <ErrorAlert message={error || ''} onClose={() => setError(null)} />

      {submitted ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800">
            If an account with that email exists, a password reset link has been sent.
            Please check your inbox and follow the instructions.
          </div>

          {devToken && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Development Reset Token
              </p>
              <p className="text-xs text-stone-700 break-all font-mono bg-white p-2 rounded-lg border border-stone-200">
                {devToken}
              </p>
              <Link
                to={`/reset-password?token=${devToken}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-800"
              >
                Go to reset password
              </Link>
            </div>
          )}

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
              <span>Sending...</span>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Send Reset Instructions</span>
              </>
            )}
          </button>
        </form>
      )}

      <div className="text-center pt-4 border-t border-stone-100 text-xs text-stone-500">
        <span>Remember your password? </span>
        <Link to="/login" className="font-bold text-red-700 hover:text-red-800">
          Sign In
        </Link>
      </div>
    </div>
  );
};
