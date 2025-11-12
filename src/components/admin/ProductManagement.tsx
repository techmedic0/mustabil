
import { useEffect, useState } from 'react';
import { supabase, Product, Category } from '../../lib/supabase';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Search,
} from 'lucide-react';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    rating: '0',
    reviews_count: '0',
    badge: '',
    discount: '',
    in_stock: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setProducts(productsRes.data || []);
      setFilteredProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setFilteredProducts(products);
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.description && p.description.toLowerCase().includes(lower)) ||
        getCategoryName(p.category_id).toLowerCase().includes(lower)
    );
    setFilteredProducts(filtered);

    // Futuristic suggestion system
    const nameSuggestions = products
      .map((p) => p.name)
      .filter((n) => n.toLowerCase().includes(lower))
      .slice(0, 5);

    const categorySuggestions = categories
      .map((c) => c.name)
      .filter((c) => c.toLowerCase().includes(lower))
      .slice(0, 3);

    setSuggestions([...new Set([...nameSuggestions, ...categorySuggestions])]);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        reviews_count: parseInt(formData.reviews_count),
        category_id: formData.category_id || null,
        badge: formData.badge || null,
        discount: formData.discount || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
      category_id: product.category_id || '',
      rating: product.rating.toString(),
      reviews_count: product.reviews_count.toString(),
      badge: product.badge || '',
      discount: product.discount || '',
      in_stock: product.in_stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category_id: '',
      rating: '0',
      reviews_count: '0',
      badge: '',
      discount: '',
      in_stock: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-white">Product Management</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* 🧠 Futuristic Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 shadow-lg focus-within:shadow-purple-500/30 transition-all duration-300">
          <Search className="w-5 h-5 text-purple-300 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Search products, categories, or descriptions..."
            className="bg-transparent text-white w-full focus:outline-none placeholder-purple-300/50 text-lg"
          />
        </div>

        {/* 🔮 Animated Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute mt-2 w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-fade-in z-20">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="px-5 py-3 cursor-pointer text-purple-200 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-cyan-600/30 transition-all duration-300 flex justify-between items-center"
              >
                <span>{s}</span>
                <span className="text-xs text-cyan-400 animate-pulse">↗</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🛍️ Product Grid (2 per row on mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-105"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative h-44 bg-white/5 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-16 h-16 text-purple-300/30" />
              )}
              {product.discount && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {product.discount}
                </div>
              )}
              {product.badge && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  {product.badge}
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-bold text-white flex-1 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-purple-300 text-sm mb-2 line-clamp-2">
                {product.description || 'No description'}
              </p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-emerald-400">
                  ₦{product.price.toLocaleString()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold ${
                    product.in_stock
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {product.in_stock ? 'In Stock' : 'Out'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-purple-400">
                <span>{getCategoryName(product.category_id)}</span>
                <span>⭐ {product.rating} ({product.reviews_count})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-purple-300 text-lg">No matching products found.</p>
        </div>
      )}

      {/* 🚀 Futuristic Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={resetForm} />

          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/30 via-cyan-500/20 to-purple-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-cyan-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-emerald-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
          </div>

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scroll-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-3xl shadow-2xl border-2 border-white/20 animate-fade-in-up">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600/90 via-cyan-600/90 to-purple-600/90 backdrop-blur-xl px-6 sm:px-8 py-6 border-b-2 border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center animate-pulse">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {editingId ? 'Edit Product' : 'Create Product'}
                  </h3>
                  <p className="text-purple-200 text-sm">Fill in the details below</p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all hover:rotate-90 duration-300"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Product Name */}
              <div className="group">
                <label className="block text-purple-200 mb-2 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-5 py-4 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-cyan-500 transition-all duration-300 hover:border-white/20"
                  placeholder="e.g., Golden Wheat Flour 10kg"
                />
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-purple-200 mb-2 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-5 py-4 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-cyan-500 transition-all duration-300 hover:border-white/20 resize-none"
                  placeholder="Brief description of the product..."
                />
              </div>

              {/* Price & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-purple-200 mb-2 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-5 py-4 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 hover:border-white/20"
                    placeholder="0.00"
                  />
                </div>

                <div className="group">
                  <label className="block text-purple-200 mb-2 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-5 py-4 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-cyan-500 transition-all duration-300 hover:border-white/20 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-slate-800">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="group">
                <label className="block text-purple-200 mb-2 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-5 py-4 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300 hover:border-white/20"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-4 relative rounded-2xl overflow-hidden border-2 border-white/10 max-w-xs">
                    <img src={formData.image_url} alt="Preview" className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
              </div>

              {/* Rating & Reviews Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="group">
                  <label className="block text-purple-200 mb-2 font-bold text-xs uppercase tracking-wider">
                    Rating
                  </label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300"
                    placeholder="4.5"
                  />
                </div>

                <div className="group">
                  <label className="block text-purple-200 mb-2 font-bold text-xs uppercase tracking-wider">
                    Reviews
                  </label>
                  <input
                    type="number"
                    value={formData.reviews_count}
                    onChange={(e) => setFormData({ ...formData, reviews_count: e.target.value })}
                    min="0"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    placeholder="42"
                  />
                </div>

                <div className="group col-span-2 sm:col-span-1">
                  <label className="block text-purple-200 mb-2 font-bold text-xs uppercase tracking-wider">
                    Stock
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, in_stock: !formData.in_stock })}
                    className={`w-full px-4 py-3 rounded-xl font-bold transition-all duration-300 border-2 ${
                      formData.in_stock
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-red-500/20 border-red-500/50 text-red-300'
                    }`}
                  >
                    {formData.in_stock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              </div>

              {/* Badge & Discount Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-purple-200 mb-2 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-5 py-4 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 hover:border-white/20"
                    placeholder="e.g., New Arrival"
                  />
                </div>

                <div className="group">
                  <label className="block text-purple-200 mb-2 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    Discount (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-5 py-4 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 hover:border-white/20"
                    placeholder="e.g., -20%"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-white/10">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient" />
                  <Save className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">{editingId ? 'Update Product' : 'Create Product'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none px-8 py-4 bg-white/5 backdrop-blur-md text-purple-200 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 border-2 border-white/10 hover:border-white/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



