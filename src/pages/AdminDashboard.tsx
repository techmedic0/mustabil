import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Package, Tag, BarChart3, Sparkles, Truck, Clock, Settings } from 'lucide-react';
import CategoryManagement from '../components/admin/CategoryManagement';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import ReservationManagement from '../components/admin/ReservationManagement';
import DashboardStats from '../components/admin/DashboardStats';
import SettingsManagement from '../components/admin/SettingsManagement';

type Tab = 'stats' | 'categories' | 'products' | 'orders' | 'reservations' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'stats' as Tab, label: 'Dashboard', icon: BarChart3 },
    { id: 'categories' as Tab, label: 'Categories', icon: Tag },
    { id: 'products' as Tab, label: 'Products', icon: Package },
    { id: 'orders' as Tab, label: 'Orders', icon: Truck },
    { id: 'reservations' as Tab, label: 'Reservations', icon: Clock },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Kingdom</h1>
                <p className="text-purple-300 text-sm">Mustabil Command Center</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all duration-300 border border-red-500/30"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-xl scale-105'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="animate-fade-in">
          {activeTab === 'stats' && <DashboardStats />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'reservations' && <ReservationManagement />}
          {activeTab === 'settings' && <SettingsManagement />}
        </div>
      </div>
    </div>
  );
}
