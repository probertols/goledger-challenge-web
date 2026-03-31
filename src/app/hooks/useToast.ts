import { useEffect, useRef, useState } from 'react';

export type ToastType = 'success' | 'delete' | 'error';

export type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
};

type ToastInput = Omit<ToastItem, 'id'>;

export function useToast() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timeoutIds = useRef<Record<string, number>>({});

  function dismissToast(id: string) {
    const timeoutId = timeoutIds.current[id];

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      delete timeoutIds.current[id];
    }

    setItems((current) => current.filter((toast) => toast.id !== id));
  }

  function pushToast(toast: ToastInput) {
    const id = crypto.randomUUID();
    setItems((current) => [...current, { id, ...toast }]);
    timeoutIds.current[id] = window.setTimeout(() => dismissToast(id), 3600);
  }

  useEffect(
    () => () => {
      Object.values(timeoutIds.current).forEach((timeoutId) => window.clearTimeout(timeoutId));
    },
    []
  );

  return {
    items,
    pushToast,
    dismissToast
  };
}
