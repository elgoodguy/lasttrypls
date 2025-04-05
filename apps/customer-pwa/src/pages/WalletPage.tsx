import React from 'react';

export const WalletPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mi Billetera</h1>
      <div className="space-y-4">
        {/* TODO: Add wallet balance and payment methods */}
        <p className="text-muted-foreground">No hay métodos de pago configurados</p>
      </div>
    </div>
  );
}; 