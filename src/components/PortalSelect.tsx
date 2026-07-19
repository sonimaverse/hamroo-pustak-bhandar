import { ShieldCheck, Store } from 'lucide-react';

interface PortalSelectProps {
  onSelectCustomer: () => void;
  onSelectAdmin: () => void;
}

export default function PortalSelect({ onSelectCustomer, onSelectAdmin }: PortalSelectProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-100 via-cream-50 to-cream-200 px-4">
      <div className="w-full max-w-3xl text-center">
        <span className="font-script text-5xl text-gold-500">Hamro</span>
        <h1 className="mt-1 font-serif text-3xl font-extrabold text-brown-800 sm:text-4xl">
          PUSTAK BHANDAR
        </h1>
        <p className="mt-3 text-brown-500">Choose how you&rsquo;d like to continue</p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <button
            onClick={onSelectCustomer}
            className="group flex flex-col items-center gap-4 rounded-2xl border border-brown-100 bg-white px-8 py-10 shadow-soft transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-card"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-600 transition group-hover:bg-gold-500 group-hover:text-white">
              <Store size={30} strokeWidth={1.8} />
            </span>
            <span className="font-serif text-xl font-bold text-brown-800">Customer Portal</span>
            <span className="text-sm text-brown-500">
              Browse and shop books, stationery &amp; more &mdash; no account needed.
            </span>
          </button>

          <button
            onClick={onSelectAdmin}
            className="group flex flex-col items-center gap-4 rounded-2xl border border-brown-100 bg-white px-8 py-10 shadow-soft transition hover:-translate-y-1 hover:border-navy-300 hover:shadow-card"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 text-navy-700 transition group-hover:bg-navy-700 group-hover:text-white">
              <ShieldCheck size={30} strokeWidth={1.8} />
            </span>
            <span className="font-serif text-xl font-bold text-brown-800">Admin Portal</span>
            <span className="text-sm text-brown-500">
              Staff login required &mdash; manage inventory, orders &amp; pricing.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
