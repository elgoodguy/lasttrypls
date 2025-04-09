-- Add GIN index for accepted_postal_codes array column
CREATE INDEX idx_stores_accepted_postal_codes ON public.stores USING GIN (accepted_postal_codes); 