import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onBack, onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter both email and password.');
      return;
    }

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onLoginSuccess();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-50 px-4">
      <motion.div
        className="w-full max-w-md rounded-3xl border border-coffee-100 bg-white p-10 shadow-xl shadow-coffee-900/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-coffee-600 transition hover:text-coffee-800"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        <div className="mb-8 flex flex-col items-center text-center">
          <motion.span
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-200 bg-gold-50 text-gold-600"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <ShieldCheck size={28} />
          </motion.span>
          <h1 className="mt-5 font-serif text-2xl font-bold text-coffee-800">Admin Portal</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in with your staff credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-coffee-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hamropustak.com.np"
              className="w-full rounded-xl border border-coffee-200 bg-ivory-50 px-4 py-3 text-sm text-coffee-800 outline-none placeholder:text-slate-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-coffee-700">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-coffee-200 bg-ivory-50 px-4 py-3 pr-10 text-sm text-coffee-800 outline-none placeholder:text-slate-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
              />
              <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <motion.button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-coffee-700 py-3.5 text-sm font-bold tracking-wide text-ivory-50 transition hover:bg-coffee-800 disabled:opacity-60"
            whileHover={{ scale: submitting ? 1 : 1.01 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
          >
            {submitting ? 'Signing in...' : 'SIGN IN'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Placeholder login for development. Connect to Supabase Auth with admin role check.
        </p>
      </motion.div>
    </div>
  );
}
