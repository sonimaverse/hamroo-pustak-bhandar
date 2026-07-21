import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Store, Warehouse, ArrowRight } from 'lucide-react';
import BookCard from './BookCard';
import { featuredBooks } from '../data/books';

type PriceMode = 'retail' | 'wholesale';

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

export default function FeaturedBooks({ onOpenEnquiry }: { onOpenEnquiry: () => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [priceMode, setPriceMode] = useState<PriceMode>('retail');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(featuredBooks.map((b) => b.category)));
    return ['All', ...cats];
  }, []);

  const filteredBooks = useMemo(() => {
    if (activeCategory === 'All') return featuredBooks;
    return featuredBooks.filter((b) => b.category === activeCategory);
  }, [activeCategory]);

  const scrollByCards = (direction: 1 | -1) => {
    railRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <section id="books" className="relative bg-white py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gold-100/40 to-transparent" />

      <motion.div
        className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between" variants={itemVariants}>
          <div>
            <motion.div className="inline-flex items-center gap-2 rounded-full border border-coffee-200/60 bg-ivory-50 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-coffee-500">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              OUR COLLECTION
            </motion.div>
            <h2 className="mt-5 font-serif text-4xl font-bold text-coffee-700 sm:text-5xl">
              Featured Books
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500 max-w-lg">
              Discover handpicked titles from our curated collection of academic, fiction, and reference books.
            </p>
            <span className="mt-5 block h-1 w-20 rounded-full bg-gradient-to-r from-gold-500 to-gold-300" />
          </div>
          <div className="flex items-center rounded-2xl border border-coffee-200 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setPriceMode('retail')}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold tracking-widest transition-all duration-200 ${
                priceMode === 'retail'
                  ? 'bg-coffee-700 text-ivory-50 shadow-md'
                  : 'text-coffee-600 hover:text-coffee-800'
              }`}
            >
              <Store size={14} />
              RETAIL
            </button>
            <button
              onClick={() => setPriceMode('wholesale')}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold tracking-widest transition-all duration-200 ${
                priceMode === 'wholesale'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-coffee-600 hover:text-coffee-800'
              }`}
            >
              <Warehouse size={14} />
              WHOLESALE
            </button>
          </div>
        </motion.div>

        <motion.div className="mb-10 flex flex-wrap gap-2" variants={itemVariants}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold tracking-wide transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-coffee-700 text-ivory-50 shadow-md'
                  : 'border border-coffee-200 bg-white text-coffee-600 hover:border-gold-300 hover:text-coffee-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div className="relative" variants={itemVariants}>
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards(-1)}
            className="absolute -left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-coffee-200 bg-white/90 text-coffee-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-gold-300 hover:text-coffee-800 sm:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div ref={railRef} className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-4">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                variants={itemVariants}
                custom={index}
              >
                <BookCard book={book} priceMode={priceMode} />
              </motion.div>
            ))}
          </div>

          <button
            aria-label="Scroll right"
            onClick={() => scrollByCards(1)}
            className="absolute -right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-coffee-200 bg-white/90 text-coffee-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-gold-300 hover:text-coffee-800 sm:flex"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>

        <motion.div className="mt-16 text-center" variants={itemVariants}>
          <motion.button
            onClick={onOpenEnquiry}
            className="inline-flex items-center gap-3 rounded-full border-2 border-coffee-200 bg-white px-8 py-4 text-sm font-bold tracking-widest text-coffee-700 shadow-sm transition-all duration-300 hover:border-gold-400 hover:text-coffee-800 hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            NEED BULK PRICING?
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
