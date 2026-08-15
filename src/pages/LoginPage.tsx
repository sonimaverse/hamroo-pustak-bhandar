import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { BookOpen, LogIn, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Sign In | Hamro Pustak Bhandar';
  }, []);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 shadow-2xs space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center mx-auto shadow-xs">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Welcome Back</h1>
        <p className="text-xs text-stone-500 font-medium">
          Sign in to access your cart, orders, and wholesale rates
        </p>
      </div>

      <ErrorAlert message={error || ''} onClose={() => setError(null)} />

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

        <div>
          <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Access Helpers */}
      <div className="pt-4 border-t border-stone-100 space-y-2">
        <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center">
          Quick Demo Accounts (1-Click Fill)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@hamropustak.com');
              setPassword('Password123!');
            }}
            className="px-2 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold text-center transition cursor-pointer"
          >
            🛡️ Admin
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('wholesale@hamropustak.com');
              setPassword('Password123!');
            }}
            className="px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-[11px] font-bold text-center transition cursor-pointer"
          >
            🏢 Wholesale
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('customer@hamropustak.com');
              setPassword('Password123!');
            }}
            className="px-2 py-2 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-[11px] font-bold text-center transition cursor-pointer"
          >
            👤 Customer
          </button>
        </div>
      </div>

      <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
        <span>Don't have an account yet? </span>
        <Link to="/register" className="font-bold text-red-700 hover:text-red-800">
          Register Here
        </Link>
      </div>

    </div>
  );
};
