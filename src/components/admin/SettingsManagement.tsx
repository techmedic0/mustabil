import { useState, useEffect } from 'react';
import { Save, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SettingsManagement() {
  const [deliveryFee, setDeliveryFee] = useState('1500');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'delivery_fee')
        .maybeSingle();

      if (error) throw error;
      if (data) setDeliveryFee(data.value);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setMessage('');
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('settings')
        .update({ value: deliveryFee, updated_at: new Date().toISOString() })
        .eq('key', 'delivery_fee');

      if (error) throw error;

      setMessage('Delivery fee updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-emerald-400" />
          Delivery Settings
        </h2>

        <div className="bg-black/30 rounded-xl p-6 border border-white/10">
          <label className="block text-purple-300 text-sm font-semibold mb-2">
            Standard Delivery Fee (₦)
          </label>
          <p className="text-gray-400 text-sm mb-4">
            This fee will be applied to all delivery orders
          </p>

          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                min="0"
                step="100"
                className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter delivery fee"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save
                </>
              )}
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('success')
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="mt-6 bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
          <p className="text-purple-300 text-sm">
            <strong>Note:</strong> Changes to the delivery fee will apply immediately to all new orders. Existing orders will maintain their original delivery fee.
          </p>
        </div>
      </div>
    </div>
  );
}
