import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, BookOpen } from 'lucide-react';
import { Book } from '../../types/book';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addItem, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  // Price resolution from backend response
  const displayPrice = book.effectivePrice ?? book.price ?? book.regularPrice;
  const isDiscounted = book.isWholesaleDiscounted && book.regularPrice > displayPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addItem(book._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      // Error handled by cart context
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      
      {/* Book Cover Container */}
      <Link to={`/books/${book._id}`} className="relative bg-stone-100 aspect-3/4 overflow-hidden flex items-center justify-center p-4 group-hover:bg-stone-200/60 transition">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full object-contain drop-shadow-md group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-400 p-4 text-center">
            <BookOpen className="w-12 h-12 mb-2 stroke-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">No Cover Image</span>
          </div>
        )}

        {/* Stock Status Badge */}
        {book.status === 'out_of_stock' || book.stockQuantity <= 0 ? (
          <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
            Out of Stock
          </div>
        ) : isDiscounted ? (
          <div className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs">
            Wholesale Price
          </div>
        ) : null}
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-1">
            {typeof book.category === 'object' ? book.category?.name : 'Book'}
          </div>
          <Link to={`/books/${book._id}`}>
            <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-red-700 transition">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 font-medium mt-1 line-clamp-1">
            by {book.author}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-stone-900">
                Rs. {displayPrice.toLocaleString()}
              </span>
              {isDiscounted && (
                <span className="text-xs text-stone-400 line-through font-medium">
                  Rs. {book.regularPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 block font-medium">
              Stock: {book.stockQuantity}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={book.status === 'out_of_stock' || book.stockQuantity <= 0 || adding || loading}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              added
                ? 'bg-emerald-700 text-white'
                : book.status === 'out_of_stock' || book.stockQuantity <= 0
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-red-700 hover:bg-red-800 text-white shadow-xs active:scale-95'
            }`}
            title="Add to Cart"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
