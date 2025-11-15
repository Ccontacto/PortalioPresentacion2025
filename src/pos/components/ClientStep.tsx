import React, { useState, useEffect } from 'react';
import { usePOS } from '../contexts/POSContext';
import { Client } from '../types';

const ClientStep: React.FC = () => {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const { order, setClient } = usePOS();

  useEffect(() => {
    fetch('http://localhost:3001/clients')
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.phone.includes(search)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  }, [search, clients]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSelectClient = (client: Client) => {
    setClient(client);
    setSearch('');
  };

  return (
    <div>
      <h2>1. Cliente</h2>
      <form>
        <input
          type="text"
          placeholder="Buscar o agregar cliente por nombre o teléfono"
          value={search}
          onChange={handleSearchChange}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </form>
      {search && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Resultados de la búsqueda:</h3>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div key={client.id} style={{ marginBottom: '0.5rem' }}>
                <button type="button" onClick={() => handleSelectClient(client)}>
                  {client.name} - {client.phone}
                </button>
              </div>
            ))
          ) : (
            <p>No se encontraron clientes.</p>
          )}
          <button type="button">Agregar nuevo cliente</button>
        </div>
      )}
      {order.client && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Cliente seleccionado:</h3>
          <p>{order.client.name}</p>
        </div>
      )}
    </div>
  );
};

export default ClientStep;
