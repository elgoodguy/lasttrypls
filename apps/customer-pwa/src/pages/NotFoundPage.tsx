import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@repo/ui';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-muted-foreground">Página no encontrada</p>
      <Link to="/">
        <Button variant="default">Volver al inicio</Button>
      </Link>
    </div>
  );
}; 