import React from 'react';

export const CartPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mi Carrito</h1>
      <div className="space-y-4">
        {/* TODO: Add cart items list */}
        <p className="text-muted-foreground">Tu carrito está vacío</p>
      </div>
    </div>
  );
}; 