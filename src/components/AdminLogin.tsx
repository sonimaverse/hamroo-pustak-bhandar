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

    // TODO: replace with real authentication, e.g.
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    // Gate this screen's success on a verified admin role from your backend
    // (a Supabase `profiles.role === 'admin'` check enforced by RLS), not just
    // "the form was filled in correctly" as this placeholder does.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onLoginSuccess();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-brown-500 hover:text-brown-800"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-100 text-navy-700">
            <ShieldCheck size={26} />
          </span>
          <h1 className="mt-4 font-serif text-2xl font-bold text-brown-800">Admin Portal</h1>
          <p className="mt-1 text-sm text-brown-500">Sign in with your staff credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brown-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hamropustak.com.np"
              className="w-full rounded-lg border border-brown-100 px-4 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brown-700">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full rounded-lg border border-brown-100 px-4 py-2.5 pr-10 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
              />
              <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-300" />
            </div>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-navy-700 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-navy-800 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'SIGN IN'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-brown-400">
          This is a placeholder login for development. Connect it to Supabase Auth with a
          server-checked admin role before storing any real sales or pricing data.
        </p>
      </div>
    </div>
  );
}
