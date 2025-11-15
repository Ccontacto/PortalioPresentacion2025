import React, { useState, useEffect } from 'react';
import { usePOS } from '../contexts/POSContext';
import type { OrderItem } from '../types';

const OrderStep: React.FC = () => {
  const { order, addItem, removeItem, updateItemQuantity } = usePOS();
  const { items } = order;
  const [products, setProducts] = useState<Omit<OrderItem, 'quantity'>[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleAddItem = (product: Omit<OrderItem, 'quantity'>) => {
    const existingItem = items.find((item) => item.id === product.id);
    if (existingItem) {
      updateItemQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      addItem({ ...product, quantity: 1 });
    }
  };

  return (
    <div>
      <h2>3. Ítems del Pedido</h2>
      <div>
        <h3>Productos</h3>
        {products.map((product) => (
          <div key={product.id} style={{ marginBottom: '1rem' }}>
            <p>
              {product.name} - ${product.price}
            </p>
            <button type="button" onClick={() => handleAddItem(product)}>
              Agregar
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <h3>Pedido</h3>
        {items.length === 0 ? (
          <p>No hay productos en el pedido.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} style={{ marginBottom: '1rem' }}>
              <p>
                {item.name} - ${item.price} x {item.quantity}
              </p>
              <button
                type="button"
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <button type="button" onClick={() => removeItem(item.id)}>
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderStep;
