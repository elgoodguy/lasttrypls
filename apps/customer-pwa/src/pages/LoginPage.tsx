import React from 'react';
import { Button } from '@repo/ui';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4">
      <h1 className="text-3xl font-bold">Bienvenido a DeliverEase</h1>
      <p className="text-center text-muted-foreground">
        Inicia sesión para acceder a todas las funcionalidades
      </p>
      <div className="flex flex-col w-full max-w-sm gap-4">
        <Button variant="default" size="lg">
          Continuar con Google
        </Button>
        <Button variant="outline" size="lg">
          Continuar con Email
        </Button>
      </div>
    </div>
  );
}; 