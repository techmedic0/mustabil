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

function App() {
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
