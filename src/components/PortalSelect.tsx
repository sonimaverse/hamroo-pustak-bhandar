import { motion } from 'framer-motion';
import { ShieldCheck, Store } from 'lucide-react';

interface PortalSelectProps {
  onSelectCustomer: () => void;
  onSelectAdmin: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function PortalSelect({ onSelectCustomer, onSelectAdmin }: PortalSelectProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-50 px-4">
      <motion.div
        className="w-full max-w-3xl text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <span className="font-script text-5xl text-gold-600">Hamro</span>
          <h1 className="mt-1 font-serif text-3xl font-extrabold text-coffee-700 sm:text-4xl">
            PUSTAK BHANDAR
          </h1>
          <p className="mt-3 text-slate-500">Choose how you&rsquo;d like to continue</p>
        </motion.div>

        <motion.div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2" variants={containerVariants}>
          <motion.button
            onClick={onSelectCustomer}
            className="group flex flex-col items-center gap-5 rounded-3xl border border-coffee-100 bg-white px-8 py-10 shadow-lg shadow-coffee-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-coffee-900/10"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <motion.span
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-200 bg-gold-50 text-gold-600 transition-colors duration-300 group-hover:bg-gold-600 group-hover:text-white"
              whileHover={{ scale: 1.05 }}
            >
              <Store size={30} strokeWidth={1.8} />
            </motion.span>
            <span className="font-serif text-xl font-bold text-coffee-700">Customer Portal</span>
            <span className="text-sm text-slate-500">
              Browse and shop books, stationery &amp; more &mdash; no account needed.
            </span>
          </motion.button>

          <motion.button
            onClick={onSelectAdmin}
            className="group flex flex-col items-center gap-5 rounded-3xl border border-coffee-100 bg-white px-8 py-10 shadow-lg shadow-coffee-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-coffee-900/10"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <motion.span
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-200 bg-gold-50 text-gold-600 transition-colors duration-300 group-hover:bg-gold-600 group-hover:text-white"
              whileHover={{ scale: 1.05 }}
            >
              <ShieldCheck size={30} strokeWidth={1.8} />
            </motion.span>
            <span className="font-serif text-xl font-bold text-coffee-700">Admin Portal</span>
            <span className="text-sm text-slate-500">
              Staff login required &mdash; manage inventory, orders &amp; pricing.
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
