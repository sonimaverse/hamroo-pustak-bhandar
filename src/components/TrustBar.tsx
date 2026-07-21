import { motion } from 'framer-motion';
import { BadgeCheck, Tag, Truck, ShieldCheck, Headphones, Landmark } from 'lucide-react';

const items = [
  { icon: BadgeCheck, title: 'Genuine Books', subtitle: '100% Original' },
  { icon: Tag, title: 'Best Prices', subtitle: 'Affordable for all' },
  { icon: Truck, title: 'Fast Delivery', subtitle: 'Across Nepal' },
  { icon: ShieldCheck, title: 'Secure Payment', subtitle: '100% Safe' },
  { icon: Headphones, title: 'Customer Support', subtitle: "We're here to help" },
  { icon: Landmark, title: 'Wholesale Available', subtitle: 'Best rates for dealers' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TrustBar() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
      <motion.div
        className="grid grid-cols-2 gap-4 rounded-3xl border border-coffee-100 bg-white/90 px-6 py-8 shadow-xl shadow-coffee-900/5 backdrop-blur-xl sm:grid-cols-3 lg:grid-cols-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
      >
        {items.map(({ icon: Icon, title, subtitle }) => (
          <motion.div
            key={title}
            className="flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:text-left lg:gap-3"
            variants={itemVariants}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold-200 bg-gold-50 text-gold-600">
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-coffee-700">{title}</span>
              <span className="block text-xs text-slate-500">{subtitle}</span>
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
