import React, { createContext, useState, useContext } from 'react';
import type { Address, Client, Order, OrderItem, POSContextType } from '../types';

const POSContext = createContext<POSContextType | undefined>(undefined);

const calculateTotal = (items: OrderItem[]) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [order, setOrder] = useState<Order>({
    client: null,
    address: null,
    items: [],
    total: 0,
  });

  const setClient = (client: Client) => {
    setOrder((prevOrder) => ({ ...prevOrder, client }));
  };

  const setAddress = (address: Address) => {
    setOrder((prevOrder) => ({ ...prevOrder, address }));
  };

  const addItem = (item: OrderItem) => {
    setOrder((prevOrder) => {
      const newItems = [...prevOrder.items, item];
      return {
        ...prevOrder,
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const removeItem = (itemId: string) => {
    setOrder((prevOrder) => {
      const newItems = prevOrder.items.filter((item) => item.id !== itemId);
      return {
        ...prevOrder,
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setOrder((prevOrder) => {
      const newItems = prevOrder.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      return {
        ...prevOrder,
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  return (
    <POSContext.Provider
      value={{
        order,
        setClient,
        setAddress,
        addItem,
        removeItem,
        updateItemQuantity,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
