

import {
  Plus, Edit2, Trash2, Save, X,
  Coffee, Flame, Droplet, PenTool, Baby, CupSoda, Sparkles, Wine, UtensilsCrossed, Package, ShoppingBasket, SprayCan, Soup
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase, Category } from '../lib/supabase';

interface CategoriesProps {
  scrollY: number;
}

const iconMap: Record<string, any> = {
  Package, Coffee, Flame, Droplet, PenTool, Baby, CupSoda, Sparkles,
  Wine, UtensilsCrossed, ShoppingBasket, SprayCan, Soup
};

export default function Categories({ scrollY }: CategoriesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section id="categories-section" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need, all in one place
          </p>
        </div>

        {/* MOBILE: Carousel */}
        <div className="sm:hidden overflow-x-hidden">
          <motion.div
            className="flex space-x-6 overflow-x-auto pb-4 scroll-hidden"
            drag="x"
            dragConstraints={{ left: -400, right: 0 }}
            dragElastic={0.2}
            whileTap={{ cursor: "grabbing" }}
          >
            {categories.map((category, index) => {
              const Icon = iconMap[category.icon] || Package;
              const delay = index * 0.1;
              return (
                <motion.div
                  key={category.id}
                  onClick={() => navigate(`/products?category=${category.id}`)}
                  className={`${category.bg_color} min-w-[260px] flex-shrink-0 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay, type: "spring", stiffness: 60 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description || 'Shop now'}</p>
                    <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-semibold`}>
                      {category.items_count} items
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* DESKTOP: Grid layout */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Package;
            const delay = index * 100;
            return (
              <div
                key={category.id}
                onClick={() => navigate(`/products?category=${category.id}`)}
                className={`group relative transition-all duration-700 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{
                  transitionDelay: `${delay}ms`,
                  transform: isVisible ? 'translateY(0) rotateY(0deg)' : 'translateY(20px) rotateY(-15deg)',
                }}
              >
                <div
                  className={`${category.bg_color} rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer`}
                >
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xs font-bold">→</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description || 'Shop now'}</p>
                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-semibold`}>
                    {category.items_count} items
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}