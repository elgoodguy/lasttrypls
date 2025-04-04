// Ejemplo de hook para consumir datos de Supabase
// Necesitarías instalar @tanstack/react-query en tu proyecto principal para usar esto

import { OrderStatus } from '@repo/types';
import { createSupabaseClient } from '../index';

export type UseOrdersOptions = {
  supabaseUrl: string;
  supabaseKey: string;
  userId?: string;
  status?: OrderStatus;
};

export const useOrders = async ({ 
  supabaseUrl, 
  supabaseKey, 
  userId, 
  status 
}: UseOrdersOptions): Promise<any[]> => {
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
  
  let query = supabase
    .from('orders')
    .select('*, profiles(*)');
  
  if (userId) {
    query = query.eq('userId', userId);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
  
  return data || [];
};

// Versión para React Query
/*
export const useOrdersQuery = (
  { supabaseUrl, supabaseKey, userId, status }: UseOrdersOptions,
  queryOptions = {}
) => {
  return useQuery({
    queryKey: ['orders', { userId, status }],
    queryFn: () => useOrders({ supabaseUrl, supabaseKey, userId, status }),
    ...queryOptions,
  });
};
*/ 