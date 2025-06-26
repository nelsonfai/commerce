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
            <Suspense fallback={<div>Loading navigation...</div>}>
              <Navbar />
            </Suspense>
            <main>
              <Suspense fallback={<div>Loading...</div>}>
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