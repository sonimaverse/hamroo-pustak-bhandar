import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookPlus } from 'lucide-react';
import { Book } from '../../types/book';
import { bookService } from '../../services/bookService';
import { BookGrid } from '../shop/BookGrid';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const NewArrivals: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const data = await bookService.getBooks({ sortBy: 'createdAt', order: 'desc', limit: 8 });
        setBooks(data.books);
      } catch (err) {
        console.error('Failed to load new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (!loading && books.length === 0) return null;

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider">
            <BookPlus className="w-3.5 h-3.5" />
            <span>Fresh Off The Press</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">New Arrivals in Nepal</h2>
        </div>

        <Link
          to="/shop?sortBy=createdAt-desc"
          className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 transition"
        >
          <span>View All New Additions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Fetching newly arrived titles..." />
      ) : (
        <BookGrid books={books} />
      )}
    </section>
  );
};
