import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Admin Login | Hamro Pustak Bhandar';
  }, []);

  const from =
    (location.state as any)?.from?.pathname || '/admin';

  // If already authenticated as admin, go directly to admin dashboard.
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (user.role === 'admin') {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const loggedInUser = await login({
        email: email.trim(),
        password,
      });

      if (loggedInUser.role !== 'admin') {
        setError(
          'This account does not have administrator privileges. Please use an administrator account.'
        );
        return;
      }

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Invalid administrator email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">

          {/* Header */}
          <div className="text-center space-y-3 mb-7">
            <div className="w-14 h-14 rounded-2xl bg-purple-900 text-white flex items-center justify-center mx-auto shadow-sm">
              <Shield className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl font-serif font-bold text-stone-900">
                Administrator Login
              </h1>

              <p className="mt-2 text-xs text-stone-500 font-medium">
                Sign in to access the Hamro Pustak Bhandar administration portal.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5">
              <ErrorAlert
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                Administrator Email
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                Password
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 p-1 text-stone-400 hover:text-stone-700 transition"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In as Administrator</span>
                </>
              )}
            </button>
          </form>

          {/* Back to Store */}
          <div className="mt-7 pt-5 border-t border-stone-100">
            <Link
              to="/"
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Store</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;