import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';

// Tipo para los posibles temas
export type Theme = 'light' | 'dark' | 'system';

// Interfaz para el valor del contexto
interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Estado inicial por defecto
const initialState: ThemeProviderState = {
  theme: 'system', // Puedes poner 'dark' si prefieres ese como default inicial
  setTheme: () => null,
};

// Crear el contexto
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string; // Clave para localStorage
}

// Crear el componente Provider
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme', // Puedes usar un nombre específico como 'customer-pwa-theme'
  ...props
}: ThemeProviderProps) {
  // Estado para el tema, inicializado desde localStorage o defaultTheme
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // Efecto para aplicar la clase al HTML y guardar en localStorage
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      console.log(`ThemeProvider: Applied system theme -> ${systemTheme}`); // Log para debug
    } else {
      root.classList.add(theme);
       console.log(`ThemeProvider: Applied theme -> ${theme}`); // Log para debug
    }

    // Guardar en localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]); // Ejecutar cuando theme o storageKey cambien

  // Función para actualizar el tema
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Valor del contexto memoizado
  const value = useMemo(() => ({
    theme,
    setTheme,
  }), [theme]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
}; 