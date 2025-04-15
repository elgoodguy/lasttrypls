import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

// Tipo Theme definido para las props (puede venir de @repo/types si lo prefieres)
export type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  theme: Theme; // Prop: Tema actual
  setTheme: (theme: Theme) => void; // Prop: Función para cambiar el tema
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme, className }) => {
  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn('h-8 w-8 border-muted', className)}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 