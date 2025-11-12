import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Eye } from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      processing: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      shipped: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      delivered: 'bg-green-500/20 text-green-300 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Order Management</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <Package className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <p className="text-purple-300 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-purple-200 text-sm">Order Number</p>
                  <p className="text-2xl font-bold text-white">{order.order_number}</p>
                  <p className="text-purple-300 text-sm mt-1">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className={`px-4 py-2 rounded-xl font-semibold border-2 ${getStatusColor(order.status)} bg-transparent focus:outline-none`}
                >
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="confirmed" className="bg-slate-800">Confirmed</option>
                  <option value="processing" className="bg-slate-800">Processing</option>
                  <option value="shipped" className="bg-slate-800">Shipped</option>
                  <option value="delivered" className="bg-slate-800">Delivered</option>
                  <option value="cancelled" className="bg-slate-800">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-purple-200 text-sm">Customer</p>
                  <p className="text-white font-semibold">{order.user_name}</p>
                  <p className="text-purple-300 text-sm">{order.user_email}</p>
                  <p className="text-purple-300 text-sm">{order.user_phone}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Delivery Address</p>
                  <p className="text-white">{order.delivery_address}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Total Amount</p>
                  <p className="text-3xl font-bold text-emerald-400">₦{order.total_amount.toLocaleString()}</p>
                  <p className="text-purple-300 text-sm">Payment: {order.payment_status}</p>
                </div>
              </div>

              {order.notes && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-purple-200 text-sm mb-1">Notes</p>
                  <p className="text-white">{order.notes}</p>
                </div>
              )}

              <div className="mt-4">
                <p className="text-purple-200 text-sm mb-2">Items</p>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-white">{item.product_name} x {item.quantity}</span>
                      <span className="text-emerald-400 font-semibold">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
