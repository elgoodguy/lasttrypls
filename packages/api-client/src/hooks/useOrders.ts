// Ejemplo de hook para consumir datos de Supabase
// Necesitarías instalar @tanstack/react-query en tu proyecto principal para usar esto

import { OrderStatus } from '@repo/types';
import { createSupabaseClient } from '../index';
// @ts-ignore - React Query is an optional dependency
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';
import { getOrders, createOrder, updateOrder, type Order, type OrderInsert, type OrderUpdate, type GetOrdersOptions } from '../orders/queries';

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

/**
 * Hook para obtener órdenes con React Query
 * @param supabase - Instancia del cliente Supabase
 * @param options - Opciones de filtrado
 * @returns Query result con las órdenes
 */
export const useOrdersQuery = (
  supabase: SupabaseClient<Database>,
  options: GetOrdersOptions = {}
) => {
  return useQuery({
    queryKey: ['orders', options],
    queryFn: () => getOrders(supabase, options),
  });
};

/**
 * Hook para crear una nueva orden
 * @param supabase - Instancia del cliente Supabase
 * @returns Mutation result para crear órdenes
 */
export const useCreateOrder = (supabase: SupabaseClient<Database>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: OrderInsert) => createOrder(supabase, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

/**
 * Hook para actualizar una orden existente
 * @param supabase - Instancia del cliente Supabase
 * @returns Mutation result para actualizar órdenes
 */
export const useUpdateOrder = (supabase: SupabaseClient<Database>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, updates }: { orderId: string; updates: OrderUpdate }) =>
      updateOrder(supabase, orderId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}; 