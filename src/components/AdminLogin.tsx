import { useState, FormEvent } from 'react';
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
    <div className="flex min-h-screen items-center justify-center bg-[#1a1209] px-4">
      <div className="w-full max-w-md rounded-2xl border border-gold-500/10 bg-[#2d1a0a]/80 p-8 shadow-card backdrop-blur-sm">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gold-400/60 hover:text-gold-300"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400">
            <ShieldCheck size={26} />
          </span>
          <h1 className="mt-4 font-serif text-2xl font-bold text-gold-200">Admin Portal</h1>
          <p className="mt-1 text-sm text-gold-400/60">Sign in with your staff credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gold-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hamropustak.com.np"
              className="w-full rounded-lg border border-gold-500/20 bg-[#1a1209]/60 px-4 py-2.5 text-sm text-gold-200 outline-none placeholder:text-gold-400/40 focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gold-300">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gold-500/20 bg-[#1a1209]/60 px-4 py-2.5 pr-10 text-sm text-gold-200 outline-none placeholder:text-gold-400/40 focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500/20"
              />
              <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold-400/40" />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gold-500 py-3 text-sm font-bold tracking-wide text-brown-900 transition hover:bg-gold-400 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'SIGN IN'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gold-400/40">
          Placeholder login for development. Connect to Supabase Auth with admin role check.
        </p>
      </div>
    </div>
  );
}