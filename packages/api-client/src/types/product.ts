export interface Product {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  compare_at_price: number | null;
  image_urls: string[] | null;
  is_active: boolean;
  product_type: 'physical' | 'prepared';
  created_at: string;
  updated_at: string;
  store_products?: {
    is_available_in_store: boolean;
    store_id: string;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCategoryAssignment {
  product_id: string;
  category_id: string;
} 