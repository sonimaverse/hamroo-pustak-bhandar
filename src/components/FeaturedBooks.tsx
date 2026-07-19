import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Store, Warehouse, ArrowRight } from 'lucide-react';
import BookCard from './BookCard';
import { featuredBooks } from '../data/books';

type PriceMode = 'retail' | 'wholesale';

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
    <section id="books" className="relative bg-gradient-to-b from-[#1a1209] to-[#2d1a0a] py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gold-500/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-gold-200 sm:text-4xl">Our Collection</h2>
            <span className="mt-3 block h-1 w-16 rounded-full bg-gold-500" />
          </div>
          <div className="flex items-center rounded-full border border-gold-500/20 bg-gold-500/5 p-1">
            <button
              onClick={() => setPriceMode('retail')}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-widest transition ${
                priceMode === 'retail'
                  ? 'bg-gold-500 text-brown-900 shadow-[0_0_20px_rgba(212,168,87,0.3)]'
                  : 'text-gold-300/70 hover:text-gold-200'
              }`}
            >
              <Store size={14} />
              RETAIL
            </button>
            <button
              onClick={() => setPriceMode('wholesale')}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-widest transition ${
                priceMode === 'wholesale'
                  ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'text-gold-300/70 hover:text-gold-200'
              }`}
            >
              <Warehouse size={14} />
              WHOLESALE
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide transition ${
                activeCategory === cat
                  ? 'bg-gold-500 text-brown-900 shadow-[0_0_15px_rgba(212,168,87,0.3)]'
                  : 'border border-gold-500/20 bg-gold-500/5 text-gold-300/70 hover:border-gold-500/40 hover:text-gold-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards(-1)}
            className="absolute -left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold-500/20 bg-[#1a1209]/80 text-gold-300 backdrop-blur-sm transition hover:border-gold-500/40 hover:text-gold-200 sm:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div ref={railRef} className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} priceMode={priceMode} />
            ))}
          </div>

          <button
            aria-label="Scroll right"
            onClick={() => scrollByCards(1)}
            className="absolute -right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold-500/20 bg-[#1a1209]/80 text-gold-300 backdrop-blur-sm transition hover:border-gold-500/40 hover:text-gold-200 sm:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onOpenEnquiry}
            className="inline-flex items-center gap-3 rounded-full border border-gold-500/30 bg-gold-500/10 px-8 py-4 text-sm font-bold tracking-widest text-gold-300 transition hover:bg-gold-500/20 hover:text-gold-200"
          >
            NEED BULK PRICING?
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}