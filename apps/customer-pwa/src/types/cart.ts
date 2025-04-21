export interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  optionsPrice: number;
  quantity: number;
  image?: string;
  description?: string;
} 