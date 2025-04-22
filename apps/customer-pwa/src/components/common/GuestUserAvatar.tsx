import React from 'react';
import { Avatar, AvatarFallback } from '@repo/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui';
import { Button } from '@repo/ui';
import { useTranslation } from 'react-i18next';
import { AuthModal } from '@/components/auth/AuthModal';

export const GuestUserAvatar: React.FC = () => {
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full">
            <Avatar className="h-12 w-12">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsAuthModalOpen(true)}>
            {t('auth.login.button')} / {t('auth.signup.button')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}; 