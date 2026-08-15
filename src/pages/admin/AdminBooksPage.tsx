import React, { useEffect, useState } from 'react';
import { Book } from '../../types/book';
import { Category } from '../../types/category';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { BookOpen, Plus, Trash2, Edit3, RefreshCw, Search } from 'lucide-react';

export const AdminBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [regularPrice, setRegularPrice] = useState('500');
  const [wholesalePrice, setWholesalePrice] = useState('350');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [booksRes, catsRes] = await Promise.all([
        bookService.getBooks({ limit: 100 }),
        categoryService.getCategories(),
      ]);
      setBooks(booksRes.books);
      setCategories(catsRes.categories);
      if (catsRes.categories.length > 0 && !category) {
        setCategory(catsRes.categories[0]._id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load books catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setIsbn('');
    setDescription('');
    setRegularPrice('500');
    setWholesalePrice('350');
    setStockQuantity('50');
    setEditingBookId(null);
    setShowModal(false);
  };

  const handleEdit = (book: Book) => {
    setEditingBookId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn || '');
    setDescription(book.description || '');
    setCategory(typeof book.category === 'object' ? book.category?._id : book.category);
    setRegularPrice(book.regularPrice.toString());
    setWholesalePrice(book.wholesalePrice ? book.wholesalePrice.toString() : '');
    setStockQuantity(book.stockQuantity.toString());
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookService.deleteBook(id);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !category) {
      setError('Title, author, and category are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('isbn', isbn);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('regularPrice', regularPrice);
      if (wholesalePrice) formData.append('wholesalePrice', wholesalePrice);
      formData.append('stockQuantity', stockQuantity);

      if (editingBookId) {
        await bookService.updateBook(editingBookId, formData);
      } else {
        await bookService.createBook(formData);
      }

      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save book.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700">
            <BookOpen className="w-4 h-4" />
            <span>Book Inventory Management</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Book Catalog ({books.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Book
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Filter / Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter books by title or author..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-2xl text-xs font-medium"
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Fetching books inventory..." />
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Title & Author</th>
                  <th className="p-3">ISBN</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Regular Price</th>
                  <th className="p-3 text-right">Wholesale Price</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBooks.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50">
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{b.title}</div>
                      <div className="text-[11px] text-stone-500">by {b.author}</div>
                    </td>
                    <td className="p-3 font-mono text-stone-600">{b.isbn || 'N/A'}</td>
                    <td className="p-3 text-stone-700 font-medium">
                      {typeof b.category === 'object' ? b.category?.name : 'General'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-stone-900">
                      Rs. {b.regularPrice.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-700">
                      {b.wholesalePrice ? `Rs. ${b.wholesalePrice.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-3 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] ${b.stockQuantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {b.stockQuantity}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() => handleEdit(b)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900 pb-2 border-b border-stone-100">
              {editingBookId ? 'Edit Book Record' : 'Add New Book'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Author *</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Regular Price *</label>
                  <input
                    type="number"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Wholesale Price</label>
                  <input
                    type="number"
                    value={wholesalePrice}
                    onChange={(e) => setWholesalePrice(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-2xs"
                >
                  {formSubmitting ? 'Saving...' : 'Save Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
