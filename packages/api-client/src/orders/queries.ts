import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';
import { OrderStatus } from '@repo/types';

// TODO: Add proper types when orders table is added to Database type
export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  // Add other fields as needed
}

export interface OrderInsert {
  user_id: string;
  store_id: string;
  status: OrderStatus;
  total_amount: number;
  contact_name: string;
  contact_phone: string;
  delivery_address: string;
  delivery_fee_amount: number;
  items: any[]; // TODO: Add proper type for order items
  payment_method: 'card' | 'cash' | 'terminal';
  order_number: string;
  subtotal_amount: number;
  cancellation_reason?: string | null;
  cashback_discount_amount?: number | null;
  cashback_earned_amount?: number | null;
  // Add other fields as needed
}

export interface OrderUpdate {
  status?: OrderStatus;
  total_amount?: number;
  // Add other fields as needed
}

export interface GetOrdersOptions {
  userId?: string;
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}

/**
 * Fetches orders with optional filtering
 * @param supabase - Supabase client instance
 * @param options - Filtering options
 * @returns Array of orders with related profile data
 */
export const getOrders = async (
  supabase: SupabaseClient<Database>,
  options: GetOrdersOptions = {}
): Promise<Order[]> => {
  const { userId, status, limit, offset } = options;

  let query = supabase.from('orders').select('*, profiles(*)');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return (data as unknown as Order[]) || [];
};

/**
 * Creates a new order
 * @param supabase - Supabase client instance
 * @param orderData - Order data to insert
 * @returns Created order
 */
export const createOrder = async (
  supabase: SupabaseClient<Database>,
  orderData: OrderInsert
): Promise<Order> => {
  const { data, error } = await supabase.from('orders').insert(orderData).select().single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned after order creation');
  }

  return data as unknown as Order;
};

/**
 * Updates an existing order
 * @param supabase - Supabase client instance
 * @param orderId - ID of the order to update
 * @param updates - Order data to update
 * @returns Updated order
 */
export const updateOrder = async (
  supabase: SupabaseClient<Database>,
  orderId: string,
  updates: OrderUpdate
): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned after order update');
  }

  return data as unknown as Order;
};
