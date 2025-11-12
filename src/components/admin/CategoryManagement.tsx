import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Save, X,
  Coffee, Flame, Droplet, PenTool, Baby, CupSoda, Sparkles, Wine, UtensilsCrossed, Package, ShoppingBasket, SprayCan, Soup
} from 'lucide-react';
import { supabase, Category } from '../../lib/supabase';

const ICON_OPTIONS = [
  'Package', 'Coffee', 'Flame', 'Droplet', 'PenTool', 'Baby', 'CupSoda', 'Sparkles',
  'Wine', 'UtensilsCrossed', 'ShoppingBasket', 'SprayCan', 'Soup'
];

const COLOR_OPTIONS = [
  'from-pink-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-green-600',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-orange-600',
  'from-fuchsia-500 to-indigo-600',
];
const BG_COLOR_OPTIONS = [
  'bg-pink-50',
  'bg-cyan-50',
  'bg-emerald-50',
  'bg-orange-50',
  'bg-yellow-50',
  'bg-fuchsia-50',
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Package',
    color: 'from-cyan-500 to-blue-600',
    bg_color: 'bg-cyan-50',
  });

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      // Smooth scroll into perfect view with futuristic transition
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [showForm]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([formData]);
        if (error) throw error;
      }
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon,
      color: category.color,
      bg_color: category.bg_color,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'Package',
      color: 'from-cyan-500 to-blue-600',
      bg_color: 'bg-cyan-50',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-8 overflow-hidden"
    >
      <div className="flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-slate-900/60 p-4 rounded-2xl shadow-lg border border-cyan-500/10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-white tracking-tight"
        >
          Category Management
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-cyan-500/40 hover:shadow-lg transition-all duration-300"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Close Form' : 'Add Category'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            ref={formRef}
            initial={{ height: 0, opacity: 0, scale: 0.96, y: 40 }}
            animate={{ height: 'auto', opacity: 1, scale: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.div
              className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                {editingId ? 'Edit Category' : 'Create New Category'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-100 mb-2">Name</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="e.g., Foodstuff"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-100 mb-2">Icon</label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon} className="bg-slate-800">
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-100 mb-2">Gradient</label>
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    >
                      {COLOR_OPTIONS.map((color) => (
                        <option key={color} value={color} className="bg-slate-800">
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-100 mb-2">Background</label>
                    <select
                      value={formData.bg_color}
                      onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    >
                      {BG_COLOR_OPTIONS.map((bgColor) => (
                        <option key={bgColor} value={bgColor} className="bg-slate-800">
                          {bgColor}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-100 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                    placeholder="Brief category description..."
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/30"
                  >
                    <Save className="w-5 h-5" />
                    {editingId ? 'Update' : 'Create'}
                  </motion.button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-white/10 text-cyan-100 rounded-xl font-semibold hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto scrollbar-hide pb-10">
        {categories.map((category, index) => {
          const Icon = (category.icon && (('lucide-react')[category.icon])) || Package;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
              <p className="text-cyan-200/70 text-sm mb-3">{category.description || 'No description'}</p>
              <span className="text-cyan-400 text-xs font-semibold">{category.items_count} items</span>
            </motion.div>
          );
        })}
      </div>

      {categories.length === 0 && !showForm && (
        <p className="text-center text-cyan-200 text-lg py-10">
          No categories yet. Add your first one!
        </p>
      )}
    </motion.div>
  );
}
