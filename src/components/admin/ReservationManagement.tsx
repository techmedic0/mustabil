import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Clock } from 'lucide-react';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      loadReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      ready: 'bg-green-500/20 text-green-300 border-green-500/30',
      picked_up: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      expired: 'bg-red-500/20 text-red-300 border-red-500/30',
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
        <h2 className="text-3xl font-bold text-white">Reservation Management</h2>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <Clock className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <p className="text-purple-300 text-lg">No reservations yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-purple-200 text-sm">Reservation ID</p>
                  <p className="text-2xl font-bold text-white">{reservation.id.substring(0, 13)}</p>
                  <p className="text-purple-300 text-sm mt-1">{new Date(reservation.created_at).toLocaleString()}</p>
                </div>
                <select
                  value={reservation.status}
                  onChange={(e) => updateReservationStatus(reservation.id, e.target.value)}
                  className={`px-4 py-2 rounded-xl font-semibold border-2 ${getStatusColor(reservation.status)} bg-transparent focus:outline-none`}
                >
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="ready" className="bg-slate-800">Ready</option>
                  <option value="picked_up" className="bg-slate-800">Picked Up</option>
                  <option value="expired" className="bg-slate-800">Expired</option>
                  <option value="cancelled" className="bg-slate-800">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-purple-200 text-sm">Customer</p>
                  <p className="text-white font-semibold">{reservation.user_name}</p>
                  <p className="text-purple-300 text-sm">{reservation.user_email}</p>
                  <p className="text-purple-300 text-sm">{reservation.user_phone}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Expires At</p>
                  <p className="text-white font-semibold">{new Date(reservation.expires_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Total Amount</p>
                  <p className="text-3xl font-bold text-emerald-400">₦{reservation.total_amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-purple-200 text-sm mb-2">Items</p>
                <div className="space-y-2">
                  {reservation.items.map((item: any, index: number) => (
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
