import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@repo/ui';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@repo/ui/lib/utils';

// Define navigation items
const navItems = [
  { path: '/', label: 'Home', icon: '🏠', loggedIn: false },
  { path: '/search', label: 'Search', icon: '🔍', loggedIn: false },
  { path: '/orders', label: 'Orders', icon: '📦', loggedIn: true },
  { path: '/profile', label: 'Profile', icon: '👤', loggedIn: true },
];

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  // Determine isLoggedIn based on auth state (consider loading state)
  const isLoggedIn = !isLoading && !!user;

  return (
    <nav className="fixed bottom-0 left-0 z-10 w-full border-t bg-background">
      <div className="container flex h-16 items-center justify-around">
        {navItems.map((item) => {
          // Conditionally render based on auth state if needed
          if (item.loggedIn && !isLoggedIn) {
            return <div key={item.path} className="w-1/4"></div>; // Keep spacing consistent
          }

          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="flex w-1/4 flex-col items-center" aria-current={isActive ? 'page' : undefined}>
              <Button
                variant="ghost"
                className={cn(
                  "flex h-auto flex-col items-center justify-center space-y-1 p-2",
                  isActive ? "text-primary" : "text-muted-foreground",
                  "hover:bg-transparent hover:text-primary/80" // Adjust hover effect
                )}
              >
                 {/* TODO: Replace text icon with Lucide icon component */}
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