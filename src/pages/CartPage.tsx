import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CartPage() {
  const { items, itemCount, totalAmount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
        <Navbar />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-gray-600 mb-8">Start adding some amazing products!</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-12">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.product_name}</h3>
                      <p className="text-2xl font-bold text-emerald-600 mb-4">
                        ₦{item.product_price.toLocaleString()}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-xl font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-xl sticky top-32">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold">₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-emerald-600">₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/checkout/reservation')}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Reserve & Pick Up
                  </button>
                  <button
                    onClick={() => navigate('/checkout/delivery')}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Order for Delivery
                  </button>
                </div>

                <Link
                  to="/products"
                  className="block text-center mt-6 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
