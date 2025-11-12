

import { Star, ShoppingCart } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Product } from '../lib/supabase';

interface FeaturedProductsProps {
  scrollY: number;
}

export default function FeaturedProducts({ scrollY }: FeaturedProductsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Best deals on quality products this week
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-6 animate-fade-in-up">
  {products.map((product, index) => (
    <div
      key={product.id}
      onClick={() => navigate(`/products/${product.id}`)}
      className={`group transition-all duration-700 transform cursor-pointer ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-20 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.25)] transition-all duration-500 transform hover:scale-[1.02] border border-gray-100 relative">
        <div className="relative overflow-hidden aspect-[4/5] bg-gray-100">
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
            <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full shadow-sm">
              {product.badge}
            </div>
          )}

          {product.discount && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full shadow-sm">
              {product.discount}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 px-6 py-3 bg-white text-emerald-600 rounded-full font-semibold shadow-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            View Details
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>

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
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}