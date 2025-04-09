-- Create store_categories junction table
CREATE TABLE public.store_categories (
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (store_id, category_id)
);

-- Enable RLS
ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;

-- Add policy for authenticated users to view store categories
CREATE POLICY "Allow authenticated users to view store categories"
    ON public.store_categories
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX idx_store_categories_store_id ON public.store_categories(store_id);
CREATE INDEX idx_store_categories_category_id ON public.store_categories(category_id); 