import { ShieldCheck, Store } from 'lucide-react';

interface PortalSelectProps {
  onSelectCustomer: () => void;
  onSelectAdmin: () => void;
}

export default function PortalSelect({ onSelectCustomer, onSelectAdmin }: PortalSelectProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1209] px-4">
      <div className="w-full max-w-3xl text-center">
        <span className="font-script text-5xl text-gold-400">Hamro</span>
        <h1 className="mt-1 font-serif text-3xl font-extrabold text-gold-200 sm:text-4xl">
          PUSTAK BHANDAR
        </h1>
        <p className="mt-3 text-gold-400/60">Choose how you&rsquo;d like to continue</p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <button
            onClick={onSelectCustomer}
            className="group flex flex-col items-center gap-4 rounded-2xl border border-gold-500/20 bg-[#2d1a0a]/60 px-8 py-10 shadow-soft transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_8px_30px_rgba(212,168,87,0.15)]"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-brown-900">
              <Store size={30} strokeWidth={1.8} />
            </span>
            <span className="font-serif text-xl font-bold text-gold-200">Customer Portal</span>
            <span className="text-sm text-gold-400/60">
              Browse and shop books, stationery &amp; more &mdash; no account needed.
            </span>
          </button>

          <button
            onClick={onSelectAdmin}
            className="group flex flex-col items-center gap-4 rounded-2xl border border-gold-500/20 bg-[#2d1a0a]/60 px-8 py-10 shadow-soft transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_8px_30px_rgba(212,168,87,0.15)]"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-brown-900">
              <ShieldCheck size={30} strokeWidth={1.8} />
            </span>
            <span className="font-serif text-xl font-bold text-gold-200">Admin Portal</span>
            <span className="text-sm text-gold-400/60">
              Staff login required &mdash; manage inventory, orders &amp; pricing.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}