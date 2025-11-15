import React from 'react';
import { usePOS } from '../contexts/POSContext';

const ConfirmationStep: React.FC = () => {
  const { order } = usePOS();
  const { client, address, items, total } = order;

  const handleConfirm = () => {
    console.log('Order confirmed:', order);
  };

  return (
    <div>
      <h2>4. Confirmación y Despacho</h2>
      {client && address && items.length > 0 ? (
        <div>
          <h3>Resumen del Pedido</h3>
          <p>
            <strong>Cliente:</strong> {client.name}
          </p>
          <p>
            <strong>Dirección:</strong> {address.street}, {address.city}
          </p>
          <h4>Items:</h4>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total:</strong> ${total}
          </p>
          <button type="button" onClick={handleConfirm}>
            Confirmar y Despachar
          </button>
        </div>
      ) : (
        <p>Por favor, completa los pasos anteriores.</p>
      )}
    </div>
  );
};

export default ConfirmationStep;
