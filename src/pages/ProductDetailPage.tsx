import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useUser();

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (product) {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
      navigate('/cart');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
        <Navbar />
        <div className="pt-32 flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-gray-600 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
              {product.badge && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-emerald-500 text-white font-bold rounded-full shadow-lg">
                  {product.badge}
                </div>
              )}
              {product.discount && (
                <div className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white font-bold rounded-full shadow-lg">
                  {product.discount}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviews_count} reviews)
                  </span>
                </div>

                <div className="text-5xl font-bold text-emerald-600 mb-6">
                  ₦{product.price.toLocaleString()}
                </div>

                {product.description && (
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {product.description}
                  </p>
                )}

                <div className={`inline-block px-6 py-3 rounded-full text-sm font-bold mb-8 ${
                  product.in_stock
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                </div>
              </div>

              {product.in_stock && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl hover:border-emerald-500 transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl hover:border-emerald-500 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
