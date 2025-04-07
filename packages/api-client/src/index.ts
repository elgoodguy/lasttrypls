// API client functions will be exported from here 
import { createClient } from '@supabase/supabase-js';
// Importa los tipos generados 
import { Database } from '@repo/types';

// Variables de entorno (MEJOR gestionarlas en cada app, no aquí)
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Puedes exportar una función para crear el cliente, pasando las claves
export const createSupabaseClient = (url: string, anonKey: string) => {
   // Usando los tipos generados
   return createClient<Database>(url, anonKey);
};

// O exportar el cliente directamente si las claves son fijas (menos seguro)
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exporta hooks personalizados o funciones de API aquí
export * from './hooks/useOrders';
export * from './profiles/queries'; 