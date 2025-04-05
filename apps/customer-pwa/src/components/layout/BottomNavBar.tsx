import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@repo/ui'; // Example usage of shared component
import { cn } from '../../lib/utils'; // Local utility for class names

interface NavItem {
  path: string;
  label: string;
  icon: string;
  loggedIn?: boolean;
}

// Define navigation items based on Client App.md (Bottom Nav)
const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: '🏠' }, // Replace with actual icons (Lucide)
  { path: '/favorites', label: 'Favorites', icon: '❤️', loggedIn: true },
  { path: '/orders', label: 'Orders', icon: '📦', loggedIn: true },
  { path: '/wallet', label: 'Wallet', icon: '💰', loggedIn: true },
];

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const isLoggedIn = false; // TODO: Replace with actual auth state from context

  return (
    <nav className="fixed bottom-0 left-0 z-10 w-full border-t bg-background">
      <div className="container flex h-16 items-center justify-around">
        {navItems.map((item) => {
          // Conditionally render based on auth state if needed
          if (item.loggedIn && !isLoggedIn) {
            return null;
          }

          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center">
              <Button
                variant="ghost"
                className={cn(
                  "flex h-auto flex-col items-center justify-center space-y-1 p-2",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}; 