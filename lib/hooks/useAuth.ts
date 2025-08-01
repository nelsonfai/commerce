// lib/hooks/useAuth.ts
'use client';
import { useState, useEffect } from 'react';
import { Customer } from 'lib/customer-client';

interface AuthState {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    customer: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/customer/profile');
      
      if (response.ok) {
        const { customer } = await response.json();
        setAuthState({
          customer,
          isLoading: false,
          isAuthenticated: true
        });
      } else {
        setAuthState({
          customer: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        customer: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  };

  const login = async (data: LoginData) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error);
    }

    // Refresh auth state after successful login
    await checkAuthStatus();
    
    return response.json();
  };

  const register = async (data: RegisterData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error);
    }

    return response.json();
  };

  const logout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (response.ok) {
      setAuthState({
        customer: null,
        isLoading: false,
        isAuthenticated: false
      });
    }

    return response.json();
  };

  const updateProfile = async (updates: Partial<Customer>) => {
    const response = await fetch('/api/customer/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error);
    }

    const { customer } = await response.json();
    setAuthState(prev => ({
      ...prev,
      customer
    }));

    return customer;
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    refreshAuth: checkAuthStatus
  };
}