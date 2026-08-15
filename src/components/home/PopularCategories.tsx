import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowRight } from 'lucide-react';
import { Category } from '../../types/category';
import { categoryService } from '../../services/categoryService';

export const PopularCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories();
        setCategories(data.categories);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section className="my-8 sm:my-12 bg-white rounded-3xl border border-stone-200 p-4 sm:p-8 shadow-2xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-700">Explore Genres</span>
          <h2 className="text-xl font-serif font-bold text-stone-900 mt-0.5">Popular Categories</h2>
        </div>

        <Link
          to="/shop"
          className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1"
        >
          <span>All Categories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/shop?category=${cat.slug}`}
            className="p-4 bg-stone-50 hover:bg-red-50 border border-stone-200 hover:border-red-200 rounded-2xl text-center transition group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-stone-700 group-hover:text-red-700 group-hover:bg-red-100/50 flex items-center justify-center font-bold shadow-2xs transition">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 group-hover:text-red-700 line-clamp-1">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
