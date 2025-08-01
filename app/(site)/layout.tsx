// app/(site)/layout.tsx
import { CartProvider } from 'components/cart/cart-context';
import { ProductProvider } from 'components/product/product-context';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { getCart } from 'lib/shopify';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from 'contexts/AuthContext';
import type { Metadata } from 'next';
import { baseUrl } from 'lib/utils';


const { SITE_NAME } = process.env;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

// Full Screen Centered Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-neutral-900 z-50">
      <div className="flex flex-col items-center  justify-center space-y-4">
        <img src="/logo-mobile.png" alt="Logo" className=" w-32 md:w-48  animate-pulse" />
      </div>
    </div>
  );
}

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();

  return (
    <AuthProvider>
      <CartProvider cartPromise={cart}>
        <ProductProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Navbar />
          </Suspense>
          <main>
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}
