import { useState, useEffect } from 'react';
import { Package, Clock, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('reservations').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
      ]);

      setOrders(ordersRes.data || []);
      setReservations(reservationsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-cyan-100 text-cyan-700',
      delivered: 'bg-green-100 text-green-700',
      ready: 'bg-green-100 text-green-700',
      picked_up: 'bg-gray-100 text-gray-700',
      expired: 'bg-red-100 text-red-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-12">My Orders & Reservations</h1>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Truck className="w-5 h-5" />
                Orders ({orders.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                activeTab === 'reservations'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                Reservations ({reservations.length})
              </div>
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'orders' && (
                <>
                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">No orders yet</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Order Number</p>
                            <p className="text-xl font-bold text-gray-900">{order.order_number}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="text-lg font-bold text-emerald-600">₦{order.total_amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Payment Status</p>
                              <p className="text-lg font-semibold text-gray-900">{order.payment_status}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Delivery Address</p>
                            <p className="text-gray-900">{order.delivery_address}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'reservations' && (
                <>
                  {reservations.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">No reservations yet</p>
                    </div>
                  ) : (
                    reservations.map((reservation) => (
                      <div key={reservation.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Reservation ID</p>
                            <p className="text-xl font-bold text-gray-900">{reservation.id.substring(0, 8)}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(reservation.status)}`}>
                            {reservation.status}
                          </span>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="text-lg font-bold text-emerald-600">₦{reservation.total_amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Expires At</p>
                              <p className="text-gray-900">{new Date(reservation.expires_at).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
