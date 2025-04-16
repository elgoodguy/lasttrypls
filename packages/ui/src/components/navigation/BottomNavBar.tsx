import React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  requiresAuth?: boolean;
}

export interface BottomNavBarProps {
  items: NavItem[];
  currentPath: string;
  isAuthenticated?: boolean;
  onNavigate: (path: string) => void;
  className?: string;
}

export function BottomNavBar({
  items,
  currentPath,
  isAuthenticated = false,
  onNavigate,
  className = '',
}: BottomNavBarProps) {
  return (
    <nav className={cn('fixed bottom-0 left-0 z-10 w-full border-t bg-background', className)}>
      <div className="container flex h-20 items-center justify-between px-4">
        {items.map(item => {
          // Skip auth-required items if not authenticated
          if (item.requiresAuth && !isAuthenticated) {
            return <div key={item.path} className="w-1/4"></div>; // Keep spacing consistent
          }

          const isActive = currentPath === item.path;
          const Icon = item.icon;

          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => onNavigate(item.path)}
              className={cn(
                'flex h-auto w-1/4 flex-col items-center justify-center p-1',
                isActive ? 'text-primary' : 'text-muted-foreground',
                'hover:bg-transparent hover:text-primary/80'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center justify-center w-full">
                <Icon className="mx-auto h-8 w-8" />
              </div>
              <span className="text-xs text-center w-full mt-0.5">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
