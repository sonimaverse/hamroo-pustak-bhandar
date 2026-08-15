import React from 'react';
import { Category } from '../../types/category';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  sortBy,
  onSortByChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-6 shadow-2xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-red-700" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-bold text-stone-500 hover:text-red-700 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        >
          <option value="createdAt-desc">Newest Arrivals</option>
          <option value="regularPrice-asc">Price: Low to High</option>
          <option value="regularPrice-desc">Price: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedCategory === ''
                ? 'bg-red-700 text-white font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat.slug
                  ? 'bg-red-700 text-white font-bold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
          Price Range (NPR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-700/20"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-700/20"
          />
        </div>
      </div>

    </div>
  );
};
