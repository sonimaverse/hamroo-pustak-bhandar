import { ShoppingCart, Tag } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  priceMode?: 'retail' | 'wholesale';
}

export default function BookCard({ book, priceMode = 'retail' }: BookCardProps) {
  const isWholesale = priceMode === 'wholesale';
  const displayPrice = isWholesale ? book.wholesalePrice : book.retailPrice;
  const originalPrice = isWholesale ? book.retailPrice : null;
  const discount = isWholesale ? Math.round(((book.retailPrice - book.wholesalePrice) / book.retailPrice) * 100) : 0;

  return (
    <div className="group flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border border-gold-500/10 bg-[#2d1a0a]/80 shadow-soft transition hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-[0_8px_30px_rgba(212,168,87,0.15)] sm:w-52">
      <div
        className={`relative flex h-56 items-end bg-gradient-to-br p-4 sm:h-64 ${book.coverFrom} ${book.coverTo}`}
      >
        {book.isNew && (
          <span className="absolute left-3 top-3 rounded bg-gold-500 px-2 py-1 text-[10px] font-bold tracking-wide text-brown-900">
            New
          </span>
        )}
        {isWholesale && (
          <span className="absolute right-3 top-3 rounded bg-emerald-600 px-2 py-1 text-[10px] font-bold tracking-wide text-white flex items-center gap-1">
            <Tag size={10} />
            {discount}% OFF
          </span>
        )}
        <p className={`font-serif text-lg font-bold leading-tight ${book.textColor}`}>{book.title}</p>
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-gold-500/10 bg-[#1a1209]/60 p-4">
        <p className="text-sm font-semibold text-gold-200">{book.title}</p>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-gold-400">Rs. {displayPrice}</p>
          {originalPrice && (
            <p className="text-xs text-gold-400/50 line-through">Rs. {originalPrice}</p>
          )}
        </div>
        <button className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-gold-500/30 bg-gold-500/10 py-2 text-xs font-bold tracking-wide text-gold-300 transition hover:bg-gold-500/20 hover:text-gold-200">
          <ShoppingCart size={14} />
          {isWholesale ? 'GET QUOTE' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}