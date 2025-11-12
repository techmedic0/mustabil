import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ReservationCheckout from './pages/ReservationCheckout';
import DeliveryCheckout from './pages/DeliveryCheckout';
import ReservationSuccess from './pages/ReservationSuccess';
import OrderSuccess from './pages/OrderSuccess';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// ✨ Futuristic Full Page Loader Component
function FuturisticLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-900 overflow-hidden z-[9999] animate-fade-in">
      {/* Glowing Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              transform: `scale(${0.5 + Math.random()})`,
              opacity: Math.random(),
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="relative">
        <img
          src="/full-logo.png"
          alt="Mustabil Superstore"
          className="w-48 sm:w-64 md:w-72 rounded-xl animate-glow-pulse drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent blur-3xl animate-pulse"></div>
      </div>

      {/* Futuristic Text */}
      <div className="mt-10 text-center">
        <h1 className="text-emerald-400 text-2xl sm:text-3xl font-bold tracking-widest animate-pulse">
          Loading Experience...
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Please wait while we prepare your futuristic store ✨
        </p>
      </div>

      {/* Progress Ring */}
      <div className="relative mt-12 w-14 h-14">
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow" />
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500); // 2.5s load animation
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FuturisticLoader />;
  }

  return (
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout/reservation" element={<ReservationCheckout />} />
              <Route path="/checkout/delivery" element={<DeliveryCheckout />} />
              <Route path="/reservation-success/:id" element={<ReservationSuccess />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
