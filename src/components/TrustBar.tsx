import { BadgeCheck, Tag, Truck, ShieldCheck, Headphones, Landmark } from 'lucide-react';

const items = [
  { icon: BadgeCheck, title: 'Genuine Books', subtitle: '100% Original' },
  { icon: Tag, title: 'Best Prices', subtitle: 'Affordable for all' },
  { icon: Truck, title: 'Fast Delivery', subtitle: 'Across Nepal' },
  { icon: ShieldCheck, title: 'Secure Payment', subtitle: '100% Safe' },
  { icon: Headphones, title: 'Customer Support', subtitle: "We're here to help" },
  { icon: Landmark, title: 'Wholesale Available', subtitle: 'Best rates for dealers' },
];

export default function TrustBar() {
  return (
    <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-6 rounded-2xl border border-gold-500/10 bg-[#2d1a0a]/90 px-6 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-6">
        {items.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/10 text-gold-400">
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-gold-200">{title}</span>
              <span className="block text-xs text-gold-400/60">{subtitle}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}