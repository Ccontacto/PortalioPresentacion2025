import { useEffect, useState } from 'react';

import { reorderItemsByTelemetry, subscribeToTelemetry } from './metrics';

const haveSameOrder = <T extends { id: string }>(prev: readonly T[], next: readonly T[]) => {
  if (prev.length !== next.length) {
    return false;
  }
  return prev.every((item, index) => item.id === next[index]?.id);
};

export function useTelemetryNavOrder<T extends { id: string }>(items: readonly T[]) {
  const [orderedItems, setOrderedItems] = useState(() => reorderItemsByTelemetry(items));

  useEffect(() => {
    setOrderedItems(reorderItemsByTelemetry(items));
  }, [items]);

  useEffect(() => {
    return subscribeToTelemetry(() => {
      setOrderedItems(prev => {
        const next = reorderItemsByTelemetry(items);
        return haveSameOrder(prev, next) ? prev : next;
      });
    });
  }, [items]);

  return orderedItems;
}
