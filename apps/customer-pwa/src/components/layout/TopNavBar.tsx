import React from 'react';
import { Button } from '@repo/ui'; // Example usage of shared component

export const TopNavBar: React.FC = () => {
  // TODO: Implement actual Top Nav based on Client App.md specs
  //       (Location, Notifications, Profile/Login)
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div>
          {/* Placeholder for Location */}
          <Button variant="ghost">📍 Current Location</Button>
        </div>
        <div className="flex items-center space-x-2">
          {/* Placeholder for Notifications */}
          <Button variant="ghost" size="icon">🔔</Button>
          {/* Placeholder for Profile/Login */}
          <Button variant="ghost" size="icon">👤</Button>
        </div>
      </div>
    </header>
  );
}; 