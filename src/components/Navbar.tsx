import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Package } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut, isAdmin: userIsAdmin } = useUser();
  const { isAdmin: authIsAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const isAdmin = userIsAdmin || authIsAdmin;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* ✅ Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.25)] transition-all duration-300 overflow-hidden">
                <img
                  src="/main-logo.png"
                  alt="Mustabil Superstore"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent tracking-tight">
                  Mustabil
                </span>
                <p className="text-xs text-gray-500">Superstore</p>
              </div>
            </Link>


            {/* ✅ Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                Products
              </Link>
              {user && (
                <Link to="/my-orders" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  My Orders
                </Link>
              )}
            </div>

            {/* ✅ Right Side Actions */}
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  Dashboard
                </Link>
              )}

              {user && !isAdmin && (
                <Link
                  to="/cart"
                  className="relative p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </button>
              )}

              {/* ✅ Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in-down">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              {user && (
                <Link
                  to="/my-orders"
                  className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-3 bg-purple-100 text-purple-700 rounded-xl font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl text-left font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ✅ Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
