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

export interface ProductModifier {
  id: string;
  name: string;
  additional_price: number;
  is_active: boolean;
  sort_order: number;
  group_id: string;
}

export interface ProductModifierGroup {
  id: string;
  name: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  min_selection: number;
  max_selection: number | null;
  product_id: string;
  sort_order: number;
  product_modifiers: ProductModifier[];
}

export interface ProductWithModifiers extends Product {
  product_modifier_groups: ProductModifierGroup[];
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