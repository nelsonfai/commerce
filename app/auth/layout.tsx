// app/(auth)/layout.tsx
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { baseUrl } from 'lib/utils';
import { Toaster } from 'sonner';
import { AuthProvider } from 'contexts/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Auth',
  robots: {
    follow: false,
    index: false
  }
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <main className="min-h-screen">
        {children}
        <Toaster closeButton />
      </main>
    </AuthProvider>
  );
}
