import React, { useState } from 'react';
import { Button } from '@repo/ui';
import { useAuth } from '@/providers/AuthProvider';
import { AuthModal } from '@/components/auth/AuthModal';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui";

export const TopNavBar: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const getInitials = (name: string | undefined | null) => {
     if (!name) return '?';
     return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div>
            {/* Placeholder for Location */}
            <Button variant="ghost">📍 Current Location</Button>
          </div>
          <div className="flex items-center space-x-2">
            {/* TODO: Placeholder for Notifications - Add Logic */}
             {user && <Button variant="ghost" size="icon" asChild><Link to="/notifications">🔔</Link></Button>}

            {/* Auth Button/Dropdown */}
            {isLoading ? (
               <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div> /* Simple Skeleton */
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* TODO: Use actual avatar_url from user profile data */}
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                      <AvatarFallback>{getInitials(user.user_metadata?.full_name || user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background border shadow-md" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                     <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                     <Link to="/wallet">Wallet</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Render AuthModal, controlled by state */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}; 