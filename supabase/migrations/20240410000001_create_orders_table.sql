-- Migration: Create orders table and related tables

-- Create order status enum
CREATE TYPE public.order_status AS ENUM (
    'pending_payment',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'failed'
);

-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded',
    'authorized'
);

-- Create payment method enum
CREATE TYPE public.payment_method AS ENUM (
    'card',
    'cash',
    'terminal'
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status public.order_status DEFAULT 'pending_payment',
    delivery_address JSONB NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    subtotal_amount NUMERIC NOT NULL,
    delivery_fee_amount NUMERIC NOT NULL,
    cashback_discount_amount NUMERIC DEFAULT 0,
    promo_discount_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    payment_method public.payment_method NOT NULL,
    payment_status public.payment_status DEFAULT 'pending',
    payment_gateway_reference TEXT,
    cashback_earned_amount NUMERIC DEFAULT 0,
    order_notes TEXT,
    scheduled_delivery_time TIMESTAMPTZ,
    driver_id UUID,
    store_ids UUID[],
    cancellation_reason TEXT,
    refund_option_chosen TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order_items table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    selected_options JSONB,
    item_notes TEXT,
    total_item_price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'MXN',
    status TEXT NOT NULL,
    payment_gateway TEXT NOT NULL,
    gateway_transaction_id TEXT UNIQUE NOT NULL,
    error_message TEXT,
    payment_method_details JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Allow users to view their own orders"
    ON public.orders FOR SELECT
    USING (user_id = auth.uid() OR public.is_staff());

CREATE POLICY "Allow users to create orders"
    ON public.orders FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow staff to update orders"
    ON public.orders FOR UPDATE
    USING (public.is_staff());

-- Create policies for order_items
CREATE POLICY "Allow users to view their own order items"
    ON public.order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_staff())
    ));

-- Create policies for payments
CREATE POLICY "Allow staff to view payments"
    ON public.payments FOR SELECT
    USING (public.is_staff());

-- Create indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);

-- Add trigger for updated_at on orders
CREATE TRIGGER on_orders_updated
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add comments
COMMENT ON TABLE public.orders IS 'Stores all confirmed orders in the system';
COMMENT ON TABLE public.order_items IS 'Stores individual items within each order';
COMMENT ON TABLE public.payments IS 'Stores detailed payment records for orders'; 