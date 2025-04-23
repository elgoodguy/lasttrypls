import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import initI18n from './i18n'; // Import the initialization function
import App from './App.tsx';
import './index.css';
import '@repo/ui/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createSupabaseClient } from '@repo/api-client';
import { SupabaseProvider } from './providers/SupabaseProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';

// Loading component with a clean design
const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-sm text-muted-foreground">Loading translations...</p>
    </div>
  </div>
);

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

// Initialize i18n before rendering
const init = async () => {
  try {
    // Initialize i18n and wait for it to complete
    const i18nInstance = await initI18n();

    if (!i18nInstance.isInitialized) {
      throw new Error('i18n failed to initialize properly');
    }

    // Render the app
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <Suspense fallback={<LoadingScreen />}>
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
        </Suspense>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    // Show error state in the root element
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="display: flex; height: 100vh; align-items: center; justify-content: center; flex-direction: column; color: #ef4444;">
          <h1 style="margin-bottom: 1rem;">Application Error</h1>
          <p>Failed to initialize translations. Please refresh the page.</p>
        </div>
      `;
    }
  }
};

// Start the application
init();
