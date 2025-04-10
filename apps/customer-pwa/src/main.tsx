import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n'; // Import i18n configuration
import App from './App.tsx';
import './index.css';
import '@repo/ui/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createSupabaseClient } from '@repo/api-client';
import { SupabaseProvider } from './providers/SupabaseProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';

// 1. Get Supabase URL and Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env');
}

// 2. Create the Supabase client instance using the shared function
//    Pass the Database type from @repo/types if you generated it
//    import { Database } from '@repo/types/database'
//    const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey); // Without DB types initially

// 3. Create a TanStack Query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Retry failed requests once
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Suspense para cargas futuras o por si acaso */}
    <React.Suspense fallback={<div>Loading translations...</div>}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="customer-pwa-theme">
          <SupabaseProvider supabase={supabase}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </SupabaseProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.Suspense>
  </React.StrictMode>
);
