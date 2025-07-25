// app/layout.tsx
import { CartProvider } from 'components/cart/cart-context';
import { ProductProvider } from 'components/product/product-context';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { Inter } from 'next/font/google';
import { getCart } from 'lib/shopify';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import './globals.css';
import { baseUrl } from 'lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'optional',

  variable: '--font-inter'
});

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

// Full Screen Centered Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-neutral-900 z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const cart = getCart();

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-black font-sans selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
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
      </body>
    </html>
  );
}