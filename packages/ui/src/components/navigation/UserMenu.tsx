import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface UserMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export interface UserMenuProps {
  user: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
  items: UserMenuItem[];
  className?: string;
}

function getInitials(name: string | undefined): string {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export function UserMenu({ user, items, className }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("relative h-8 w-8 rounded-full", className)}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
            <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background border shadow-md" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className={cn("cursor-pointer", { "cursor-default": !item.onClick && !item.href })}
            asChild={!!item.href}
          >
            {item.href ? (
              <a href={item.href} className="flex items-center">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <>
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 