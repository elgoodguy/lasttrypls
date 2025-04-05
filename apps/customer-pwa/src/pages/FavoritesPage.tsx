import React from 'react';

export const FavoritesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mis Favoritos</h1>
      <div className="grid gap-4">
        {/* TODO: Add favorites grid/list */}
        <p className="text-muted-foreground">No tienes favoritos aún</p>
      </div>
    </div>
  );
}; 