import React from 'react';
import { usePOS } from '../contexts/POSContext';
import { Address } from '../types';

const AddressStep: React.FC = () => {
  const { order, setAddress } = usePOS();
  const { client, address } = order;

  return (
    <div>
      <h2>2. Dirección y Logística</h2>
      {client ? (
        <div>
          <h3>Direcciones de {client.name}:</h3>
          {client.addresses.map((addr) => (
            <div key={addr.id} style={{ marginBottom: '1rem' }}>
              <p>
                {addr.street}, {addr.city}, {addr.state} {addr.zip}
              </p>
              <button type="button" onClick={() => setAddress(addr)}>
                Seleccionar esta dirección
              </button>
            </div>
          ))}
          {address && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Dirección seleccionada:</h3>
              <p>
                {address.street}, {address.city}, {address.state} {address.zip}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p>Por favor, selecciona un cliente primero.</p>
      )}
    </div>
  );
};

export default AddressStep;
