import React, { useEffect, useState } from 'react';
import { Category } from '../../types/category';
import { categoryService } from '../../services/categoryService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { FolderTree, Plus, RefreshCw } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategories();
      setCategories(data.categories);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setSubmitting(true);
      setError(null);
      await categoryService.createCategory({ name, description });
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <FolderTree className="w-4 h-4" />
            <span>Taxonomy Management</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Book Categories ({categories.length})
          </h1>
        </div>

        <button
          onClick={fetchCategories}
          className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Create Category Form */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-serif font-bold text-stone-900 pb-2 border-b border-stone-100">
            Create New Category
          </h2>

          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Higher Secondary Physics"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                rows={3}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Creating...' : 'Create Category'}</span>
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-serif font-bold text-stone-900 pb-2 border-b border-stone-100">
            Existing Categories
          </h2>

          {loading ? (
            <LoadingSpinner label="Loading categories..." />
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat._id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-stone-900">{cat.name}</h3>
                    <p className="text-stone-500">{cat.description || 'No description provided.'}</p>
                  </div>
                  <span className="font-mono text-[10px] text-stone-400 font-bold bg-stone-200 px-2 py-0.5 rounded-lg">
                    {cat.slug}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
