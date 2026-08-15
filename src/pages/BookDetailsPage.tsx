import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Book } from '../types/book';
import { bookService } from '../services/bookService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { BookOpen, ShoppingCart, Check, ArrowLeft, Tag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await bookService.getBookById(id);
        setBook(data.book);
        if (data.book?.title) {
          document.title = `${data.book.title} | Hamro Pustak Bhandar`;
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading book details..." />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-xl mx-auto my-12 space-y-4 text-center">
        <ErrorAlert message={error || 'Book not found.'} />
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const displayPrice = book.effectivePrice ?? book.price ?? book.regularPrice;
  const isDiscounted = book.isWholesaleDiscounted && book.regularPrice > displayPrice;
  const categoryName = typeof book.category === 'object' ? book.category?.name : 'General Literature';

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addItem(book._id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      // Cart context sets error state
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link to="/" className="hover:text-stone-900 transition">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-stone-900 transition">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${typeof book.category === 'object' ? book.category?.slug : ''}`} className="hover:text-stone-900 transition">
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-bold truncate max-w-xs">{book.title}</span>
      </nav>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Book Cover Image */}
        <div className="md:col-span-5 bg-stone-100 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden aspect-3/4">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="max-h-96 object-contain drop-shadow-xl"
            />
          ) : (
            <div className="flex flex-col items-center text-stone-400 text-center">
              <BookOpen className="w-20 h-20 mb-3 stroke-1" />
              <span className="text-xs font-bold uppercase tracking-wider">No Cover Image</span>
            </div>
          )}

          {book.status === 'out_of_stock' || book.stockQuantity <= 0 ? (
            <div className="absolute top-4 left-4 bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
              Out of Stock
            </div>
          ) : isDiscounted ? (
            <div className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
              Wholesale Discount Applied
            </div>
          ) : null}
        </div>

        {/* Right: Book Details & Actions */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full mb-2">
                <Tag className="w-3.5 h-3.5" /> {categoryName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                {book.title}
              </h1>
              <p className="text-sm text-stone-600 font-semibold mt-1">
                by <span className="text-stone-900">{book.author}</span>
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-stone-900 font-sans">
                Rs. {displayPrice.toLocaleString()}
              </span>
              {isDiscounted && (
                <span className="text-sm text-stone-400 line-through font-medium">
                  Rs. {book.regularPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-stone-500 font-medium ml-auto">
                Stock: <strong className="text-stone-800">{book.stockQuantity} copies</strong>
              </span>
            </div>

            {/* Book Attributes Table */}
            <div className="grid grid-cols-2 gap-3 text-xs border-y border-stone-100 py-4">
              <div>
                <span className="text-stone-400 font-semibold block">ISBN</span>
                <span className="font-mono font-bold text-stone-800">{book.isbn || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold block">SKU Code</span>
                <span className="font-mono font-bold text-stone-800">{book.sku || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold block">Publisher</span>
                <span className="font-bold text-stone-800">{book.publisher || 'Hamro Publications'}</span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold block">Language</span>
                <span className="font-bold text-stone-800">{book.language || 'Nepali / English'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Synopsis & Summary</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line font-normal">
                {book.description || 'No detailed synopsis available for this book.'}
              </p>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-stone-700 hover:bg-stone-200 rounded-l-xl font-bold disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-xs text-stone-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(book.stockQuantity, quantity + 1))}
                  disabled={quantity >= book.stockQuantity}
                  className="px-3 py-2 text-stone-700 hover:bg-stone-200 rounded-r-xl font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={book.status === 'out_of_stock' || book.stockQuantity <= 0 || adding || cartLoading}
                className={`flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : book.status === 'out_of_stock' || book.stockQuantity <= 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-red-700 hover:bg-red-800 text-white shadow-xs active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Shopping Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add {quantity} Item{quantity > 1 ? 's' : ''} to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Delivery Assurance */}
            <div className="grid grid-cols-2 gap-3 text-xs text-stone-500 pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-red-700 shrink-0" />
                <span>Express Delivery Across Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>100% Guaranteed Authentic</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
