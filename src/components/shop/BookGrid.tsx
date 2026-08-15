import React from 'react';
import { Book } from '../../types/book';
import { BookCard } from './BookCard';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  emptyMessage?: string;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, emptyMessage = 'No books found matching your criteria.' }) => {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-6 space-y-3">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 stroke-1" />
        </div>
        <h3 className="text-base font-bold text-stone-800">No Books Available</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};
