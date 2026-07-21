import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldCheck, FileText, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Books', href: '#books' },
  { label: 'Stationery', href: '#stationery' },
  { label: 'Wholesale', href: '#wholesale' },
  { label: 'Contact', href: '#contact' },
];

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const mobileVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

interface HeaderProps {
  onSwitchToAdmin: () => void;
  onOpenEnquiry: () => void;
  onToggleCart: () => void;
}

export default function Header({ onSwitchToAdmin, onOpenEnquiry, onToggleCart }: HeaderProps) {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 z-50 w-full border-b border-coffee-100 bg-ivory-50/90 backdrop-blur-xl"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <a href="#home" className="flex items-center gap-3">
          <Logo size="sm" />
        </a>

        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="relative text-sm font-semibold tracking-wide text-coffee-600 transition-colors duration-200 hover:text-coffee-800"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-gold-500 transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <motion.button
            onClick={onToggleCart}
            className="relative flex items-center gap-2 rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-sm font-semibold text-coffee-700 shadow-sm transition-all duration-200 hover:border-gold-300 hover:shadow-md"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <ShoppingCart size={16} />
            CART
            {totalItems > 0 && (
              <motion.span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {totalItems}
              </motion.span>
            )}
          </motion.button>
          <motion.button
            onClick={onOpenEnquiry}
            className="flex items-center gap-2 rounded-xl border border-coffee-200 bg-white px-4 py-2.5 text-sm font-semibold text-coffee-700 shadow-sm transition-all duration-200 hover:border-gold-300 hover:shadow-md"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <FileText size={16} />
            BULK ORDER
          </motion.button>
          <motion.button
            onClick={onSwitchToAdmin}
            className="text-coffee-400 transition-colors duration-200 hover:text-coffee-600"
            title="Admin access"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShieldCheck size={18} />
          </motion.button>
        </div>

        <motion.button
          className="flex h-11 w-11 items-center justify-center rounded-xl text-coffee-600 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="border-t border-coffee-100 bg-ivory-50/95 px-6 py-6 backdrop-blur-xl lg:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileVariants}
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-xl px-4 py-3 text-base font-semibold tracking-wide text-coffee-700 transition-colors duration-200 hover:bg-coffee-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { onToggleCart(); setMobileOpen(false); }}
                className="rounded-xl border border-coffee-200 bg-white px-4 py-3 text-left text-base font-semibold tracking-wide text-coffee-700"
              >
                Cart {totalItems > 0 && `(${totalItems})`}
              </button>
              <button
                onClick={() => { onOpenEnquiry(); setMobileOpen(false); }}
                className="rounded-xl border border-coffee-200 bg-white px-4 py-3 text-left text-base font-semibold tracking-wide text-coffee-700"
              >
                Bulk Order
              </button>
              <button
                onClick={() => { onSwitchToAdmin(); setMobileOpen(false); }}
                className="rounded-xl px-4 py-3 text-left text-base font-semibold tracking-wide text-coffee-400"
              >
                Admin
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
