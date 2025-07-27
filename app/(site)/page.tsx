// app/page.tsx

import { ThreeItemGrid } from 'components/grid/featured-products';
import Footer from 'components/layout/footer';
import ImageCarouselSection from 'components/Hero';
import { Metadata } from 'next';
export const metadata: Metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
    <ImageCarouselSection />
      <ThreeItemGrid />
      <Footer />
    </>
  );
}
