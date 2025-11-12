import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600 mb-12">
            Your order is being processed and will be delivered soon
          </p>

          {order && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-left">
              <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <Package className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="text-2xl font-bold text-emerald-600">{order.order_number}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Delivery Address</p>
                        <p className="text-gray-600">{order.delivery_address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Contact</p>
                        <p className="text-gray-600">{order.user_phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-emerald-600">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold border-t-2 border-gray-200 pt-4 mt-4">
                    <span>Total (inc. delivery)</span>
                    <span className="text-emerald-600">₦{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link
              to="/my-orders"
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
