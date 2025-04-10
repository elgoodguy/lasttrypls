import React from 'react';

export const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mis Pedidos</h1>
      <div className="space-y-4">
        {/* TODO: Add orders list with status */}
        <p className="text-muted-foreground">No tienes pedidos recientes</p>
      </div>
    </div>
  );
};
