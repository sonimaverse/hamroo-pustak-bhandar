```tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { ErrorAlert } from '../components/common/ErrorAlert';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'wholesale'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Create Account | Hamro Pustak Bhandar';
  }, []);

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (cleanName.length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await register({
        name: cleanName,
        email: cleanEmail,
        password,
        phone: cleanPhone,
        role,
      });

      if (role === 'wholesale') {
        navigate('/wholesale', { replace: true });
      } else {
        navigate(from || '/', { replace: true });
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Registration failed. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center mx-auto shadow-sm">
          <BookOpen className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Create Account
        </h1>

        <p className="text-xs text-stone-500 font-medium">
          Join Hamro Pustak Bhandar for fast ordering & wholesale discounts
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5">
          <ErrorAlert
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Full Name */}
        <div>
          <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
            Full Name *
          </label>

          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ramesh Sharma"
              autoComplete="name"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-700/20"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
            Email Address *
          </label>

          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ramesh@example.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-700/20"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
            Mobile Number
          </label>

          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+977-9841234567"
              autoComplete="tel"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-700/20"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
            Password *
          </label>

          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-700/20"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Account Type */}
        <div>
          <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
            Account Type
          </label>

          <div className="grid grid-cols-2 gap-2">
            {/* Customer */}
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={
                role === 'customer'
                  ? 'p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 bg-red-700 text-white border-red-700 shadow-sm'
                  : 'p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }
            >
              <User className="w-3.5 h-3.5" />
              <span>Retail Reader</span>
            </button>

            {/* Wholesale */}
            <button
              type="button"
              onClick={() => setRole('wholesale')}
              className={
                role === 'wholesale'
                  ? 'p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 bg-amber-900 text-white border-amber-900 shadow-sm'
                  : 'p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Wholesale Buyer</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>Creating Account...</span>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Register Account</span>
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="text-center pt-4 mt-6 border-t border-stone-100 text-xs text-stone-500">
        <span>Already registered? </span>

        <Link
          to="/login"
          state={location.state}
          className="font-bold text-red-700 hover:text-red-800"
        >
          Sign In Here
        </Link>
      </div>
    </div>
  );
};

/*
 * Both exports are intentionally provided.
 * App.tsx currently uses:
 * import { RegisterPage } from './pages/RegisterPage';
 */

export { RegisterPage };
export default RegisterPage;
```
