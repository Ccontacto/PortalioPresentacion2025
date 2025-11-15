import React from 'react';
import '../pos.css';
import ClientStep from '../components/ClientStep';
import AddressStep from '../components/AddressStep';
import OrderStep from '../components/OrderStep';
import ConfirmationStep from '../components/ConfirmationStep';

const POSView: React.FC = () => {
  return (
    <div className="pos-container">
      <h1 className="pos-title">Punto de Venta (POS)</h1>
      <div className="pos-grid">
        <div className="pos-step">
          <ClientStep />
        </div>
        <div className="pos-step">
          <AddressStep />
        </div>
        <div className="pos-step">
          <OrderStep />
        </div>
        <div className="pos-step">
          <ConfirmationStep />
        </div>
      </div>
    </div>
  );
};

export default POSView;
