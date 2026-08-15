import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Book } from '../../types/book';
import { bookService } from '../../services/bookService';
import { BookGrid } from '../shop/BookGrid';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const FeaturedBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await bookService.getBooks({ limit: 8 });
        setBooks(data.books);
      } catch (err) {
        console.error('Failed to load featured books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handpicked Collection</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">Featured Titles</h2>
        </div>

        <Link
          to="/shop"
          className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 transition"
        >
          <span>View All Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading featured collection..." />
      ) : (
        <BookGrid books={books} />
      )}
    </section>
  );
};
