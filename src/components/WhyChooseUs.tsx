import { motion } from 'framer-motion';
import { BookOpen, Truck, ShieldCheck, Headphones } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Curated Collection',
    description: 'Handpicked books across academic, fiction, and reference categories to suit every reader.',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'Reliable delivery across all districts in Nepal with real-time tracking support.',
  },
  {
    icon: ShieldCheck,
    title: 'Authentic Quality',
    description: 'Every book is sourced directly from authorized publishers. No duplicates, no compromises.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Personalized assistance for bulk orders, institutional supplies, and custom requests.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function WhyChooseUs() {
  return (
    <section id="wholesale" className="relative bg-ivory-100/60 py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gold-100/40 to-transparent" />

      <motion.div
        className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div className="mb-14 text-center" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 rounded-full border border-coffee-200/60 bg-white px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-coffee-500">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            WHY CHOOSE US
          </div>
          <h2 className="mt-5 font-serif text-4xl font-bold text-coffee-700 sm:text-5xl">
            Built for Book Lovers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
            We combine quality, trust, and service to deliver the best bookstore experience in Nepal.
          </p>
          <span className="mx-auto mt-5 block h-1 w-20 rounded-full bg-gradient-to-r from-gold-500 to-gold-300" />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group flex flex-col items-start gap-4 rounded-3xl border border-coffee-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-coffee-900/10"
              variants={itemVariants}
              custom={index}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-200 bg-gold-50 text-gold-600 transition-transform duration-300 group-hover:scale-110">
                <feature.icon size={22} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="font-serif text-xl font-bold text-coffee-700">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
