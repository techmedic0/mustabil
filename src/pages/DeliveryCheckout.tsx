import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, User, Mail, Phone, MapPin, FileText, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';
import { getDeliveryFee } from '../utils/settings';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

export default function DeliveryCheckout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(1500);

  useEffect(() => {
    loadDeliveryFee();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const loadDeliveryFee = async () => {
    const fee = await getDeliveryFee();
    setDeliveryFee(fee);
  };

  const finalTotal = totalAmount + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.product_price,
      }));

      const { data, error: dbError } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id || null,
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          delivery_address: formData.address,
          items: orderItems,
          total_amount: finalTotal,
          status: 'pending',
          payment_status: 'pending',
          notes: formData.notes || null,
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      await clearCart();
      navigate(`/order-success/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl mb-4 shadow-lg">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Delivery Checkout</h1>
            <p className="text-xl text-gray-600">
              Get your items delivered to your doorstep
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-emerald-600">₦{(item.product_price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">Delivery Fee</p>
                <p className="font-bold text-emerald-600">₦{deliveryFee.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-2xl font-bold border-t-2 border-gray-200 pt-4">
              <span>Total</span>
              <span className="text-emerald-600">₦{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone Number"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-6 text-gray-400 w-5 h-5" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Delivery Address (Include landmarks)"
                  required
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="relative">
                <FileText className="absolute left-4 top-6 text-gray-400 w-5 h-5" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional Notes (Optional)"
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-sm text-gray-600 text-center">
                Payment will be made on delivery (Cash on Delivery)
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
}
