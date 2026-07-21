import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sita Sharma',
    role: 'College Librarian',
    quote: 'Hamro Pustak Bhandar has been our go-to supplier for years. Their collection is extensive and delivery is always prompt.',
  },
  {
    name: 'Ramesh Thapa',
    role: 'School Principal',
    quote: 'The wholesale pricing and bulk order support have made managing our school library incredibly easy and cost-effective.',
  },
  {
    name: 'Anita Gurung',
    role: 'Student',
    quote: 'Love the variety and the quality of books. The WhatsApp ordering is super convenient and the staff is very helpful.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Testimonials() {
  return (
    <section className="relative bg-white py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gold-100/40 to-transparent" />

      <motion.div
        className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div className="mb-14 text-center" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 rounded-full border border-coffee-200/60 bg-ivory-50 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-coffee-500">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            TESTIMONIALS
          </div>
          <h2 className="mt-5 font-serif text-4xl font-bold text-coffee-700 sm:text-5xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
            Trusted by students, institutions, and book lovers across Nepal.
          </p>
          <span className="mx-auto mt-5 block h-1 w-20 rounded-full bg-gradient-to-r from-gold-500 to-gold-300" />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="flex flex-col gap-4 rounded-3xl border border-coffee-100 bg-ivory-50/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-coffee-900/10"
              variants={itemVariants}
              custom={index}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-base leading-relaxed text-coffee-700">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-auto pt-4 border-t border-coffee-100">
                <p className="font-serif text-lg font-bold text-coffee-800">{testimonial.name}</p>
                <p className="text-xs font-medium text-slate-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
