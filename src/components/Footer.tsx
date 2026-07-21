import { MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-coffee-800 pt-20 pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

      <motion.div
        className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={footerVariants}
      >
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={itemVariants}>
            <p className="font-script text-4xl text-gold-400">Hamro</p>
            <p className="font-serif text-xl font-bold tracking-wider text-ivory-50">PUSTAK BHANDAR</p>
            <p className="mt-4 text-sm leading-relaxed text-coffee-200">
              Your neighbourhood bookstore for school books, stationery and wholesale supply across Nepal.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-gold-400">EXPLORE</p>
            <ul className="space-y-3 text-sm text-coffee-200">
              <li><a href="#books" className="transition-colors duration-200 hover:text-gold-400">Books</a></li>
              <li><a href="#stationery" className="transition-colors duration-200 hover:text-gold-400">Stationery</a></li>
              <li><a href="#wholesale" className="transition-colors duration-200 hover:text-gold-400">Wholesale Portal</a></li>
              <li><a href="#about" className="transition-colors duration-200 hover:text-gold-400">About Us</a></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-gold-400">CATEGORIES</p>
            <ul className="space-y-3 text-sm text-coffee-200">
              <li><a href="#" className="transition-colors duration-200 hover:text-gold-400">School Books</a></li>
              <li><a href="#" className="transition-colors duration-200 hover:text-gold-400">Novels &amp; Fiction</a></li>
              <li><a href="#" className="transition-colors duration-200 hover:text-gold-400">Competitive Exams</a></li>
              <li><a href="#" className="transition-colors duration-200 hover:text-gold-400">Children&rsquo;s Books</a></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-gold-400">CONTACT</p>
            <ul className="space-y-4 text-sm text-coffee-200">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-400" />
                056-123456
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-400" />
                hello@hamropustak.com.np
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-gold-400" />
                Bharatpur, Chitwan, Nepal
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-16 border-t border-coffee-700/60 pt-8 text-center text-xs text-coffee-300">
          &copy; {new Date().getFullYear()} Hamro Pustak Bhandar. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
}
