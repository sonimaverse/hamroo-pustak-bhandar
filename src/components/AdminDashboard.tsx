// AdminDashboard.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  Clock,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  PlusCircle,
  MinusCircle,
  History,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

// --- Types ---
export interface Book {
  id: string;
  name: string;
  author: string;
  publisher: string;
  category: string;
  isbn: string;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  imageUrl: string;
}

export interface StockHistoryItem {
  id: string;
  date: string;
  bookName: string;
  added: number;
  removed: number;
  currentStock: number;
}

// --- Initial Mock Data ---
const initialBooks: Book[] = [
  {
    id: '1',
    name: 'Seto Dharti',
    author: 'Amar Neupane',
    publisher: 'FinePrint',
    category: 'Novel',
    isbn: '978-9937-665-01-2',
    retailPrice: 450,
    wholesalePrice: 380,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '2',
    name: 'Palpasa Cafe',
    author: 'Narayan Wagle',
    publisher: 'Nepalaya',
    category: 'Fiction',
    isbn: '978-99933-912-0-7',
    retailPrice: 525,
    wholesalePrice: 450,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '3',
    name: 'Karnali Chisaima',
    author: 'Bargendra Acharya',
    publisher: 'Sajha Prakashan',
    category: 'Travelogue',
    isbn: '978-99933-221-1-5',
    retailPrice: 350,
    wholesalePrice: 290,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '4',
    name: 'Radha',
    author: 'Yogesh Raj',
    publisher: 'Book Hill',
    category: 'Historical',
    isbn: '978-9937-921-44-6',
    retailPrice: 600,
    wholesalePrice: 510,
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=300'
  }
];

const initialHistory: StockHistoryItem[] = [
  {
    id: 'h1',
    date: '2026-07-22 10:30',
    bookName: 'Seto Dharti',
    added: 15,
    removed: 0,
    currentStock: 45
  },
  {
    id: 'h2',
    date: '2026-07-21 14:15',
    bookName: 'Karnali Chisaima',
    added: 0,
    removed: 5,
    currentStock: 5
  }
];

// --- Main Admin Dashboard Component ---
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>(initialHistory);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  // Categories list
  const categories = ['All', ...Array.from(new Set(books.map((b) => b.category)))];

  // Metrics calculation
  const totalBooksCount = books.length;
  const totalStockCount = books.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockCount = books.filter((b) => b.stock >= 10 && b.stock <= 30).length;
  const outOfStockCount = books.filter((b) => b.stock < 10).length;
  const todaysSales = 12450;
  const pendingOrdersCount = 4;

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  // Handlers for Add/Edit/Delete/Stock
  const handleAddBook = (newBookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...newBookData,
      id: Date.now().toString()
    };
    setBooks([newBook, ...books]);

    const historyItem: StockHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      bookName: newBook.name,
      added: newBook.stock,
      removed: 0,
      currentStock: newBook.stock
    };
    setStockHistory([historyItem, ...stockHistory]);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    const oldBook = books.find((b) => b.id === updatedBook.id);
    const stockDiff = updatedBook.stock - (oldBook ? oldBook.stock : 0);

    setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    setEditingBook(null);

    if (stockDiff !== 0) {
      const historyItem: StockHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        bookName: updatedBook.name,
        added: stockDiff > 0 ? stockDiff : 0,
        removed: stockDiff < 0 ? Math.abs(stockDiff) : 0,
        currentStock: updatedBook.stock
      };
      setStockHistory([historyItem, ...stockHistory]);
    }
  };

  const handleDeleteBook = () => {
    if (!deletingBook) return;
    setBooks(books.filter((b) => b.id !== deletingBook.id));
    setDeletingBook(null);
  };

  const handleAdjustStock = (bookId: string, amount: number) => {
    setBooks(
      books.map((book) => {
        if (book.id === bookId) {
          const newStock = Math.max(0, book.stock + amount);
          const added = amount > 0 ? amount : 0;
          const removed = amount < 0 ? Math.abs(amount) : 0;

          const historyItem: StockHistoryItem = {
            id: Date.now().toString() + Math.random(),
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            bookName: book.name,
            added,
            removed,
            currentStock: newStock
          };
          setStockHistory((prev) => [historyItem, ...prev]);

          return { ...book, stock: newStock };
        }
        return book;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-sans p-4 md:p-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#D7CCC8]/40 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4E342E] flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#D4AF37]" />
            Hamro Pustak Bhandar
          </h1>
          <p className="text-[#6D4C41] text-sm mt-1">Professional Bookstore Inventory & Admin Control Panel</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('inventory')}
            className={
              'px-4 py-2 rounded-lg text-sm font-medium transition-all ' +
              (activeTab === 'inventory'
                ? 'bg-[#4E342E] text-[#FDFBF7] shadow-md'
                : 'bg-[#EFEBE9] text-[#6D4C41] hover:bg-[#D7CCC8]/50')
            }
          >
            Inventory Management
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ' +
              (activeTab === 'history'
                ? 'bg-[#4E342E] text-[#FDFBF7] shadow-md'
                : 'bg-[#EFEBE9] text-[#6D4C41] hover:bg-[#D7CCC8]/50')
            }
          >
            <History className="w-4 h-4" /> Stock History
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#3E2723] font-semibold px-4 py-2 rounded-lg shadow-md hover:opacity-95 transition-all flex items-center gap-2 ml-2"
          >
            <Plus className="w-5 h-5" /> Add Book
          </button>
        </div>
      </header>

      {/* 1. Dashboard Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard
          title="Total Books"
          value={totalBooksCount}
          icon={<BookOpen className="w-5 h-5 text-[#D4AF37]" />}
        />
        <MetricCard
          title="Total Stock"
          value={totalStockCount}
          icon={<Package className="w-5 h-5 text-[#4E342E]" />}
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={<AlertTriangle className="w-5 h-5 text-yellow-600" />}
          highlight="yellow"
        />
        <MetricCard
          title="Out of Stock"
          value={outOfStockCount}
          icon={<XCircle className="w-5 h-5 text-red-600" />}
          highlight="red"
        />
        <MetricCard
          title="Today's Sales"
          value={'Rs. ' + todaysSales.toLocaleString()}
          icon={<DollarSign className="w-5 h-5 text-green-700" />}
        />
        <MetricCard
          title="Pending Orders"
          value={pendingOrdersCount}
          icon={<Clock className="w-5 h-5 text-[#8D6E63]" />}
        />
      </section>

      {/* Main Content Area */}
      {activeTab === 'inventory' ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#D7CCC8]/40 overflow-hidden">
          {/* Search & Filter Toolbar */}
          <div className="p-4 border-b border-[#D7CCC8]/30 flex flex-col md:flex-row gap-4 items-center justify-between bg-[#FAF8F5]">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]" />
              <input
                type="text"
                placeholder="Search by book name, ISBN, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#D7CCC8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <Filter className="w-4 h-4 text-[#8D6E63] shrink-0" />
              <span className="text-xs font-semibold text-[#6D4C41] uppercase tracking-wider shrink-0">Category:</span>
              <div className="flex gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ' +
                      (selectedCategory === cat
                        ? 'bg-[#4E342E] text-white shadow-sm'
                        : 'bg-[#EFEBE9] text-[#6D4C41] hover:bg-[#D7CCC8]/40')
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 9. Professional Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EFEBE9]/70 text-[#4E342E] text-xs font-bold uppercase tracking-wider border-b border-[#D7CCC8]/40">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Book Name & Author</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Wholesale Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Stock Quick Actions</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7CCC8]/20 text-sm">
                <AnimatePresence>
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[#8D6E63]">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No books found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => {
                      let statusBadge = {
                        bg: 'bg-green-100 text-green-800 border-green-300',
                        text: 'In Stock'
                      };
                      if (book.stock < 10) {
                        statusBadge = {
                          bg: 'bg-red-100 text-red-800 border-red-300',
                          text: 'Out of Stock'
                        };
                      } else if (book.stock <= 30) {
                        statusBadge = {
                          bg: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                          text: 'Low Stock'
                        };
                      }

                      return (
                        <motion.tr
                          key={book.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-[#FAF8F5] transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="w-10 h-14 rounded overflow-hidden bg-[#EFEBE9] border border-[#D7CCC8]/50 shrink-0">
                              {book.imageUrl ? (
                                <img
                                  src={book.imageUrl}
                                  alt={book.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#8D6E63]">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#4E342E]">{book.name}</div>
                            <div className="text-xs text-[#8D6E63]">
                              {book.author} | <span className="italic">ISBN: {book.isbn}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#EFEBE9] text-[#6D4C41]">
                              {book.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-[#3E2723]">{'Rs. ' + book.retailPrice}</td>
                          <td className="py-3 px-4 text-[#6D4C41]">{'Rs. ' + book.wholesalePrice}</td>
                          <td className="py-3 px-4 font-bold text-[#4E342E]">{book.stock}</td>
                          <td className="py-3 px-4">
                            <span
                              className={'px-2.5 py-1 rounded-full text-xs font-semibold border ' + statusBadge.bg}
                            >
                              {statusBadge.text}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleAdjustStock(book.id, -1)}
                                title="Remove 1 Stock"
                                className="p-1 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                              <span className="text-xs font-mono w-6 text-center">{book.stock}</span>
                              <button
                                onClick={() => handleAdjustStock(book.id, 1)}
                                title="Add 1 Stock"
                                className="p-1 rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors"
                              >
                                <PlusCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingBook(book)}
                                className="p-1.5 rounded-lg bg-[#EFEBE9] text-[#4E342E] hover:bg-[#D7CCC8] transition-colors"
                                title="Edit Book"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingBook(book)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Delete Book"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <StockHistory history={stockHistory} />
      )}

      {/* Modals */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBook}
      />

      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={handleUpdateBook}
        />
      )}

      {deletingBook && (
        <DeleteConfirmModal
          bookName={deletingBook.name}
          onClose={() => setDeletingBook(null)}
          onConfirm={handleDeleteBook}
        />
      )}
    </div>
  );
}

// --- Metric Card Sub-component ---
function MetricCard({
  title,
  value,
  icon,
  highlight
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  highlight?: 'yellow' | 'red';
}) {
  let borderColor = 'border-[#D7CCC8]/40';
  if (highlight === 'yellow') borderColor = 'border-yellow-400 bg-yellow-50/20';
  if (highlight === 'red') borderColor = 'border-red-400 bg-red-50/20';

  return (
    <div className={'bg-white p-4 rounded-xl shadow-sm border ' + borderColor + ' flex flex-col justify-between'}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#8D6E63] uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-[#4E342E]">{value}</div>
    </div>
  );
}

// --- AddBookModal.tsx ---
export function AddBookModal({
  isOpen,
  onClose,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    publisher: '',
    category: '',
    isbn: '',
    retailPrice: '',
    wholesalePrice: '',
    stock: '',
    imageUrl: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      author: formData.author,
      publisher: formData.publisher,
      category: formData.category || 'General',
      isbn: formData.isbn,
      retailPrice: parseFloat(formData.retailPrice) || 0,
      wholesalePrice: parseFloat(formData.wholesalePrice) || 0,
      stock: parseInt(formData.stock) || 0,
      imageUrl: formData.imageUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl border border-[#D7CCC8] w-full max-w-xl overflow-hidden my-8"
      >
        <div className="bg-[#4E342E] text-[#FDFBF7] px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#D4AF37]" /> Add New Book
          </h3>
          <button onClick={onClose} className="text-[#D7CCC8] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Book Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
                placeholder="e.g. Seto Dharti"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Author *</label>
              <input
                required
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
                placeholder="e.g. Amar Neupane"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Publisher</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
                placeholder="e.g. FinePrint"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
                placeholder="e.g. Novel, Fiction"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
                placeholder="978-..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Stock Quantity *</label>
              <input
                required
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
                placeholder="e.g. 25"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Retail Price (Rs.) *</label>
              <input
                required
                type="number"
                min="0"
                value={formData.retailPrice}
                onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
                placeholder="450"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Wholesale Price (Rs.) *</label>
              <input
                required
                type="number"
                min="0"
                value={formData.wholesalePrice}
                onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
                placeholder="380"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#D7CCC8]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#EFEBE9] text-[#6D4C41] hover:bg-[#D7CCC8]/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#4E342E] text-white hover:bg-[#3E2723] shadow-md"
            >
              Save Book
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// --- EditBookModal.tsx ---
export function EditBookModal({
  book,
  onClose,
  onSave
}: {
  book: Book;
  onClose: () => void;
  onSave: (book: Book) => void;
}) {
  const [formData, setFormData] = useState<Book>({ ...book });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl border border-[#D7CCC8] w-full max-w-xl overflow-hidden my-8"
      >
        <div className="bg-[#4E342E] text-[#FDFBF7] px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-[#D4AF37]" /> Edit Book: {book.name}
          </h3>
          <button onClick={onClose} className="text-[#D7CCC8] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Book Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Author *</label>
              <input
                required
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Publisher</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Stock Quantity *</label>
              <input
                required
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Retail Price (Rs.) *</label>
              <input
                required
                type="number"
                min="0"
                value={formData.retailPrice}
                onChange={(e) => setFormData({ ...formData, retailPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Wholesale Price (Rs.) *</label>
              <input
                required
                type="number"
                min="0"
                value={formData.wholesalePrice}
                onChange={(e) => setFormData({ ...formData, wholesalePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6D4C41] uppercase mb-1">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-[#D7CCC8] rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#D7CCC8]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#EFEBE9] text-[#6D4C41] hover:bg-[#D7CCC8]/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#4E342E] text-white hover:bg-[#3E2723] shadow-md"
            >
              Update Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// --- DeleteConfirmModal.tsx ---
export function DeleteConfirmModal({
  bookName,
  onClose,
  onConfirm
}: {
  bookName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl border border-[#D7CCC8] w-full max-w-md overflow-hidden p-6 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#4E342E] mb-2">Delete Book</h3>
        <p className="text-sm text-[#8D6E63] mb-6">
          Are you sure you want to delete <span className="font-semibold text-[#3E2723]">"{bookName}"</span>? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#EFEBE9] text-[#6D4C41] hover:bg-[#D7CCC8]/50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 shadow-md"
          >
            Yes, Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- StockHistory.tsx ---
export function StockHistory({ history }: { history: StockHistoryItem[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D7CCC8]/40 overflow-hidden">
      <div className="p-4 border-b border-[#D7CCC8]/30 bg-[#FAF8F5]">
        <h3 className="text-lg font-bold text-[#4E342E] flex items-center gap-2">
          <History className="w-5 h-5 text-[#D4AF37]" /> In-Memory Stock History Log
        </h3>
        <p className="text-xs text-[#8D6E63]">Tracks all additions and removals of book stocks dynamically.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EFEBE9]/70 text-[#4E342E] text-xs font-bold uppercase tracking-wider border-b border-[#D7CCC8]/40">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Book Name</th>
              <th className="py-3 px-4">Added</th>
              <th className="py-3 px-4">Removed</th>
              <th className="py-3 px-4">Current Stock Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7CCC8]/20 text-sm">
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#8D6E63]">
                  No stock history records available yet.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4 text-[#8D6E63] font-mono text-xs">{item.date}</td>
                  <td className="py-3 px-4 font-semibold text-[#4E342E]">{item.bookName}</td>
                  <td className="py-3 px-4 text-green-700 font-medium">
                    {item.added > 0 ? '+' + item.added : '-'}
                  </td>
                  <td className="py-3 px-4 text-red-600 font-medium">
                    {item.removed > 0 ? '-' + item.removed : '-'}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#3E2723]">{item.currentStock}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}