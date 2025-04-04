// Type definitions will be exported from here 

// Exporta tipos compartidos aquí
export interface UserProfile {
  id: string;
  fullName: string | null;
  // ... otros campos de tu tabla profiles
}

export enum OrderStatus {
  Pending = 'pending_payment',
  Confirmed = 'confirmed',
  Preparing = 'preparing',
  // ... otros estados de tu tabla orders
}

// Re-exporta los tipos generados de Supabase
export * from './database.types'; 