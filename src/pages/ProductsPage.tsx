import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  X,
  Tag,
} from 'lucide-react';
import { supabase, Product, Category } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const { addToCart } = useCart();
  const { user } = useUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').eq('in_stock', true).order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await addToCart(product);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const searchResults = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories.find(
        (c) =>
          c.id === p.category_id &&
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 relative">
      <Navbar />

      {/* Smart Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-50 flex flex-col justify-end sm:justify-center animate-fade-in">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl mx-auto w-full sm:max-w-lg p-6 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowSearchOverlay(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-emerald-500 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <Search className="text-emerald-500 w-6 h-6" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or categories..."
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-lg"
              />
            </div>

            <div className="overflow-y-auto scroll-hidden space-y-4 pb-2">
              {searchQuery === '' ? (
                <p className="text-center text-gray-500 text-sm">
                  Start typing to discover products ✨
                </p>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, i) => (
                  <Link
                    key={i}
                    to={`/product/${item.id}`}
                    onClick={() => setShowSearchOverlay(false)}
                    className="flex items-center gap-4 bg-white/70 dark:bg-gray-800/70 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-3 rounded-2xl transition-all border border-gray-100 dark:border-gray-700 hover:border-emerald-400 group"
                  >
                    <img
                      src={item.image_url || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {categories.find((c) => c.id === item.category_id)?.name}
                      </p>
                      <p className="text-emerald-600 font-bold text-sm mt-1">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">
                  No results found for “{searchQuery}”
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-xl text-gray-600">
              Discover quality products at great prices
            </p>
          </div>

          {/* Search bar that triggers overlay */}
          <div className="mb-8 space-y-4">
            <div className="relative" onClick={() => setShowSearchOverlay(true)}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tap to search products..."
                readOnly
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scroll-hidden">
              <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 animate-fade-in-up">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.25)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 relative"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="block relative overflow-hidden aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold text-sm">
                        No Image
                      </div>
                    )}
                    {product.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full shadow-sm">
                        {product.badge}
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full shadow-sm">
                        {product.discount}
                      </div>
                    )}
                  </Link>

                  <div className="p-4 sm:p-5">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {product.description && (
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] sm:text-sm text-gray-600">
                        {product.rating.toFixed(1)} ({product.reviews_count})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg sm:text-xl font-bold text-emerald-600">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2.5 sm:p-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-2xl transition-all shadow-md hover:shadow-xl hover:scale-105"
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

