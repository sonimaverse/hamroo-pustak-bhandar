import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Store, Warehouse, ArrowRight } from 'lucide-react';
import { stationeryItems } from '../data/books';

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

export default function StationerySection({ onOpenEnquiry }: { onOpenEnquiry: () => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [priceMode, setPriceMode] = useState<PriceMode>('retail');

  const scrollByCards = (direction: 1 | -1) => {
    railRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <section id="stationery" className="relative bg-cream-200/40 py-28">
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
            <motion.div className="inline-flex items-center gap-2 rounded-full border border-coffee-200/60 bg-white px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-coffee-500">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              STATIONERY
            </motion.div>
            <h2 className="mt-5 font-serif text-4xl font-bold text-coffee-700 sm:text-5xl">
              Premium Supplies
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500 max-w-lg">
              Quality stationery for students and offices — from notebooks to scientific calculators.
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

        <motion.div className="relative" variants={itemVariants}>
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards(-1)}
            className="absolute -left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-coffee-200 bg-white/90 text-coffee-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-gold-300 hover:text-coffee-800 sm:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div ref={railRef} className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-4">
            {stationeryItems.map((item, index) => {
              const price = priceMode === 'wholesale' ? item.wholesalePrice : item.retailPrice;
              const originalPrice = priceMode === 'wholesale' ? item.retailPrice : null;
              const discount = priceMode === 'wholesale' ? Math.round(((item.retailPrice - item.wholesalePrice) / item.retailPrice) * 100) : 0;

              return (
                <motion.div
                  key={item.id}
                  className="group flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl border border-coffee-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-coffee-900/10 sm:w-52"
                  variants={itemVariants}
                  custom={index}
                >
                  <div className="relative flex h-56 items-end bg-gradient-to-br from-coffee-500 to-coffee-700 p-4 sm:h-64">
                    <span className="text-4xl">{item.icon}</span>
                    {priceMode === 'wholesale' && (
                      <span className="absolute right-3 top-3 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold tracking-wide text-white flex items-center gap-1 shadow-md">
                        {discount}% OFF
                      </span>
                    )}
                    <p className="font-serif text-lg font-bold leading-tight text-white">{item.name}</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 border-t border-coffee-100 bg-ivory-50/60 p-4">
                    <p className="text-sm font-semibold text-coffee-700">{item.name}</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-coffee-800">Rs. {price}</p>
                      {originalPrice && (
                        <p className="text-xs text-slate-400 line-through">Rs. {originalPrice}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold tracking-wide ${item.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                      </span>
                      {item.stock > 0 && item.stock < 10 && (
                        <span className="text-[11px] font-bold text-amber-600">Only {item.stock} left</span>
                      )}
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <a
                        href={`https://wa.me/9779866115029?text=${encodeURIComponent(`Hi, I am interested in ${item.name}. ${priceMode === 'wholesale' ? 'Please share wholesale pricing details.' : 'Please share more details about this product.'}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-bold tracking-wide text-emerald-700 transition-all duration-200 hover:bg-emerald-100"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {item.stock > 0 ? 'ORDER ON WHATSAPP' : 'OUT OF STOCK'}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
