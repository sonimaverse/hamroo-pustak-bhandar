import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';
import { Book } from '../../types/book';
import { Category } from '../../types/category';
import { useCart } from '../../contexts/CartContext';
import { WholesaleNav } from '../../components/wholesale/WholesaleNav';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { BookOpen, Search, Filter, ShoppingCart, CheckCircle, Plus, Minus, Package, Tag } from 'lucide-react';

export const WholesaleBooksPage: React.FC = () => {
  const { addToCart } = useCart();

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Quantities state: mapping bookId -> bulk quantity
  const [quantities, setQuantities] = useState<{ [bookId: string]: number }>({});
  const [addedBookId, setAddedBookId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Wholesale Bulk Catalog | Hamro Pustak Bhandar';
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getBooks({
        search,
        category: selectedCategory,
        limit: 50,
      });
      setBooks(data.books || []);

      // Initialize default bulk quantity (e.g. 10 or 1)
      const initialQty: { [key: string]: number } = {};
      data.books.forEach((b) => {
        initialQty[b._id] = 10;
      });
      setQuantities(initialQty);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch wholesale catalog.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleQtyChange = (bookId: string, delta: number, maxStock: number) => {
    setQuantities((prev) => {
      const current = prev[bookId] || 10;
      const updated = Math.max(1, Math.min(maxStock, current + delta));
      return { ...prev, [bookId]: updated };
    });
  };

  const handleSetQty = (bookId: string, val: number, maxStock: number) => {
    const validVal = isNaN(val) ? 1 : Math.max(1, Math.min(maxStock, val));
    setQuantities((prev) => ({ ...prev, [bookId]: validVal }));
  };

  const handleAddToCart = async (book: Book) => {
    try {
      const qty = quantities[book._id] || 10;
      await addToCart(book._id, qty);
      setAddedBookId(book._id);
      setTimeout(() => setAddedBookId(null), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add item to cart.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      <WholesaleNav />

      {/* Header Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <BookOpen className="w-4 h-4" />
            <span>Institutional Supply Catalog</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Wholesale Titles & Bulk Pricing
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Discounted wholesale rates automatically apply to your cart upon order submission.
          </p>
        </div>

        <Link
          to="/cart"
          className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start md:self-auto shadow-xs"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Review Cart & Checkout</span>
        </Link>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Filter Bar */}
      <div className="bg-stone-100 rounded-2xl p-4 border border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Search Input */}
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-900/20"
          />
        </div>

        {/* Category Select */}
        <div className="md:col-span-5 relative">
          <Filter className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-900/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Catalog Table / Grid */}
      {loading ? (
        <LoadingSpinner label="Loading wholesale catalog titles..." />
      ) : books.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-stone-300 mx-auto stroke-1" />
          <h3 className="font-serif font-bold text-stone-800">No Wholesale Books Found</h3>
          <p className="text-xs text-stone-500">Try adjusting your category filter or search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {books.map((book) => {
              const qty = quantities[book._id] || 10;
              const hasWholesalePrice = typeof book.wholesalePrice === 'number' && book.wholesalePrice > 0;
              const effectivePrice = hasWholesalePrice ? book.wholesalePrice : book.regularPrice;
              const savingsPct = hasWholesalePrice && book.regularPrice > book.wholesalePrice
                ? Math.round(((book.regularPrice - book.wholesalePrice) / book.regularPrice) * 100)
                : 0;

              return (
                <div
                  key={book._id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs hover:border-amber-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  
                  {/* Book Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'}
                      alt={book.title}
                      className="w-16 h-22 object-cover rounded-xl border border-stone-200 shrink-0 bg-stone-100"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-md uppercase">
                          {typeof book.category === 'object' ? book.category?.name : 'Book'}
                        </span>
                        {savingsPct > 0 && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>Save {savingsPct}%</span>
                          </span>
                        )}
                        <span className="text-[10px] text-stone-400 font-mono">ISBN: {book.isbn}</span>
                      </div>

                      <h3 className="font-serif font-bold text-stone-900 text-sm">{book.title}</h3>
                      <p className="text-xs text-stone-500">by {book.author}</p>

                      <div className="pt-1 flex items-center gap-3 text-xs">
                        <span className="text-stone-400 line-through">Retail: Rs. {book.regularPrice}</span>
                        <span className="font-bold text-amber-900 text-sm">
                          Wholesale: Rs. {effectivePrice}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          ({book.stockQuantity} in stock)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Controls */}
                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    
                    <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                      <button
                        onClick={() => handleQtyChange(book._id, -5, book.stockQuantity)}
                        disabled={qty <= 1}
                        className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) => handleSetQty(book._id, parseInt(e.target.value, 10), book.stockQuantity)}
                        className="w-14 text-center bg-transparent font-bold text-xs text-stone-900 focus:outline-none"
                        min="1"
                        max={book.stockQuantity}
                      />
                      <button
                        onClick={() => handleQtyChange(book._id, 5, book.stockQuantity)}
                        disabled={qty >= book.stockQuantity}
                        className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(book)}
                      disabled={book.stockQuantity <= 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                        addedBookId === book._id
                          ? 'bg-emerald-700 text-white'
                          : 'bg-amber-900 hover:bg-amber-950 text-white'
                      }`}
                    >
                      {addedBookId === book._id ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-200" />
                          <span>Added {qty} Units</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add {qty} Units</span>
                        </>
                      )}
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
