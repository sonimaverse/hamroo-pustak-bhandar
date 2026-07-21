import { motion } from 'framer-motion';
import { ShoppingCart, Tag, MessageCircle } from 'lucide-react';
import { Book } from '../types';
import { useCart } from '../context/CartContext';

interface BookCardProps {
  book: Book;
  priceMode?: 'retail' | 'wholesale';
}

export default function BookCard({ book, priceMode = 'retail' }: BookCardProps) {
  const { addItem } = useCart();
  const isWholesale = priceMode === 'wholesale';
  const displayPrice = isWholesale ? book.wholesalePrice : book.retailPrice;
  const originalPrice = isWholesale ? book.retailPrice : null;
  const discount = isWholesale ? Math.round(((book.retailPrice - book.wholesalePrice) / book.retailPrice) * 100) : 0;

  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in ${book.title}. ${isWholesale ? 'Please share wholesale pricing details.' : 'Please share more details about this book.'}`
  );
  const whatsappLink = `https://wa.me/9779866115029?text=${whatsappMessage}`;

  const handleAddToCart = () => {
    addItem(book, priceMode);
  };

  return (
    <motion.div
      className="group flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl border border-coffee-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-coffee-900/10 sm:w-52"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative flex h-56 items-end bg-gradient-to-br p-5 sm:h-64 ${book.coverFrom} ${book.coverTo}`}
      >
        {book.isNew && (
          <motion.span
            className="absolute left-4 top-4 rounded-lg bg-gold-500 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.1 }}
          >
            New
          </motion.span>
        )}
        {isWholesale && (
          <span className="absolute right-4 top-4 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-md flex items-center gap-1">
            <Tag size={10} />
            {discount}% OFF
          </span>
        )}
        <p className={`font-serif text-lg font-bold leading-tight ${book.textColor}`}>{book.title}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 border-t border-coffee-100 bg-ivory-50/60 p-4">
        <p className="text-sm font-semibold text-coffee-700">{book.title}</p>
        <div className="flex flex-col gap-1">
          <p className="text-base font-bold text-coffee-800">Rs. {displayPrice}</p>
          {originalPrice && (
            <p className="text-xs text-slate-400 line-through">Rs. {originalPrice}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold tracking-wide ${book.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </span>
            {book.stock > 0 && book.stock < 10 && (
              <span className="text-[11px] font-bold text-amber-600">Only {book.stock} left</span>
            )}
          </div>
          {!isWholesale && book.stock > 0 && (
            <motion.button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 rounded-xl border border-coffee-200 bg-white py-2.5 text-xs font-bold tracking-wide text-coffee-700 transition-all duration-200 hover:border-gold-300 hover:bg-gold-50 hover:text-coffee-800"
              whileTap={{ scale: 0.97 }}
            >
              <ShoppingCart size={14} />
              ADD TO CART
            </motion.button>
          )}
          {!isWholesale && book.stock === 0 && (
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-xl border border-coffee-100 bg-coffee-50 py-2.5 text-xs font-bold tracking-wide text-coffee-400"
            >
              OUT OF STOCK
            </button>
          )}
          <motion.a
            href={book.stock > 0 ? whatsappLink : '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => book.stock === 0 && e.preventDefault()}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all duration-200 ${
              book.stock > 0
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'border border-coffee-100 bg-coffee-50 text-coffee-400 cursor-not-allowed'
            }`}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle size={14} />
            {isWholesale ? 'WHATSAPP' : book.stock > 0 ? 'ORDER ON WHATSAPP' : 'OUT OF STOCK'}
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
