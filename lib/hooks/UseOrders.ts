// lib/hooks/useOrders.ts
'use client';

import { Order } from 'lib/customer-delete';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useOrders(autoFetch: boolean = true) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchOrders = async (first: number = 10) => {
    if (!isAuthenticated) {
      setError('Not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/customer/orders?first=${first}`);
      
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const { orders } = await response.json();
      setOrders(orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, autoFetch]);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    refetch: () => fetchOrders()
  };
}