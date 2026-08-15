import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Book, BookListResponse } from '../types/book';
import { Category } from '../types/category';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import { SearchBar } from '../components/shop/SearchBar';
import { FilterPanel } from '../components/shop/FilterPanel';
import { BookGrid } from '../components/shop/BookGrid';
import { Pagination } from '../components/shop/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { SlidersHorizontal, BookOpen } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt-desc');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Data State
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch Categories on Mount & Sync URL Search Params
  useEffect(() => {
    document.title = 'Shop Books | Hamro Pustak Bhandar';
    const fetchCats = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data.categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCats();

    const querySearch = searchParams.get('search') || '';
    const queryCat = searchParams.get('category') || '';
    if (querySearch !== search) setSearch(querySearch);
    if (queryCat !== category) setCategory(queryCat);
  }, [searchParams]);

  // Fetch Books
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sortField, sortOrder] = sortBy.split('-');

      const params: any = {
        page,
        limit: 12,
        sortBy: sortField,
        order: sortOrder || 'asc',
      };

      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);

      const data: BookListResponse = await bookService.getBooks(params);
      setBooks(data.books);
      setTotalPages(data.pagination.totalPages);
      setTotalBooks(data.pagination.totalBooks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load books catalog.');
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, sortBy, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Update URL Search Params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sortBy) params.sortBy = sortBy;
    if (page > 1) params.page = page.toString();
    setSearchParams(params, { replace: true });
  }, [search, category, minPrice, maxPrice, sortBy, page, setSearchParams]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt-desc');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      
      {/* Shop Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700">
            <BookOpen className="w-4 h-4" />
            <span>Complete Bookstore Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Explore Literature & Textbooks
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing {totalBooks} available titles across Nepal's curriculum and global editions.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="md:hidden px-4 py-2 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters {category || minPrice || maxPrice ? '(Active)' : ''}</span>
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar Filter Panel (Desktop & Mobile drawer) */}
        <div className={`md:col-span-1 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <FilterPanel
            categories={categories}
            selectedCategory={category}
            onSelectCategory={(catSlug) => {
              setCategory(catSlug);
              setPage(1);
            }}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={(val) => {
              setMinPrice(val);
              setPage(1);
            }}
            onMaxPriceChange={(val) => {
              setMaxPrice(val);
              setPage(1);
            }}
            sortBy={sortBy}
            onSortByChange={(val) => {
              setSortBy(val);
              setPage(1);
            }}
            onReset={handleResetFilters}
          />
        </div>

        {/* Catalog Main View */}
        <div className="md:col-span-3 space-y-6">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by title, author, or ISBN..."
          />

          {loading ? (
            <LoadingSpinner label="Fetching catalog items..." />
          ) : (
            <>
              <BookGrid books={books} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </div>

      </div>
    </div>
  );
};
