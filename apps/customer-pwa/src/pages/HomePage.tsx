import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-center">DeliverEase</h1>
      <p className="text-center text-muted-foreground">
        Bienvenido a DeliverEase - Tu plataforma de delivery favorita
      </p>
      {/* TODO: Add featured restaurants, categories, etc. */}
    </div>
  );
}; 