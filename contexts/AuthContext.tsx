// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from 'lib/hooks/useAuth';

const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return (
        <div className="text-center py-8">
          <p>Please log in to access this page.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}