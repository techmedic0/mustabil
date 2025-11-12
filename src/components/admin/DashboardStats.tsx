import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Tag, TrendingUp, DollarSign } from 'lucide-react';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, categoriesRes, inStockRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('in_stock', true),
      ]);

      const totalProducts = productsRes.count || 0;
      const inStock = inStockRes.count || 0;

      setStats({
        totalProducts,
        totalCategories: categoriesRes.count || 0,
        inStockProducts: inStock,
        outOfStockProducts: totalProducts - inStock,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Categories',
      value: stats.totalCategories,
      icon: Tag,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'In Stock',
      value: stats.inStockProducts,
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStockProducts,
      icon: DollarSign,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-purple-300 text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Welcome to Your Kingdom</h2>
        <p className="text-purple-200 leading-relaxed mb-4">
          You have full control over your e-commerce empire. Manage categories, products, and watch your business grow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
            <ul className="space-y-2 text-purple-200">
              <li>• Add new categories to organize products</li>
              <li>• Create product listings with images</li>
              <li>• Update prices and stock status</li>
              <li>• Delete outdated items</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Tips</h3>
            <ul className="space-y-2 text-purple-200">
              <li>• Use high-quality product images</li>
              <li>• Keep descriptions clear and concise</li>
              <li>• Update stock status regularly</li>
              <li>• Set competitive prices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
