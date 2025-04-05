import React from 'react';
import { Button } from '@repo/ui';

export const ProfilePage: React.FC = () => {
  const isLoggedIn = false; // TODO: Get from auth context

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <h1 className="text-2xl font-semibold">Mi Perfil</h1>
        <p className="text-muted-foreground">Inicia sesión para ver tu perfil</p>
        <Button variant="default">Iniciar Sesión</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mi Perfil</h1>
      <div className="space-y-4">
        {/* TODO: Add profile information and settings */}
        <p className="text-muted-foreground">Información del perfil</p>
      </div>
    </div>
  );
}; 