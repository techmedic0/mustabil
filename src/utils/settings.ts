import { supabase } from '../lib/supabase';

export async function getDeliveryFee(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'delivery_fee')
      .maybeSingle();

    if (error) throw error;
    return data ? parseFloat(data.value) : 1500;
  } catch (error) {
    console.error('Error fetching delivery fee:', error);
    return 1500;
  }
}
