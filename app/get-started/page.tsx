// app/subscription-box/page.tsx
import React from 'react';
import { getCollectionProducts } from 'lib/shopify';
import SubscriptionBoxClient from './getstarted-client';
import { Metadata } from 'next';

interface SubscriptionBoxPageProps {}

export default async function SubscriptionBoxPage(): Promise<React.JSX.Element> {
  try {
    const subscriptionHandles = [
      'hidden-subscription-boxes',
    ];

    let subscriptionBoxes = null;

    // Find working subscription collection handle
    for (const handle of subscriptionHandles) {
      const result = await getCollectionProducts({ collection: "hidden-subscription-boxes" });
      if (result?.length > 0) {
        subscriptionBoxes = result;
        break;
      }
    }

    // Fetch featured products and fallback for subscription if needed
    const [featuredProducts] = await Promise.all([
      getCollectionProducts({ collection: 'featured-snacks' })
    ]);

    if (!featuredProducts?.length) {
      throw new Error('Failed to fetch featured products');
    }

    return (
      <SubscriptionBoxClient 
        subscriptionBoxes={subscriptionBoxes || featuredProducts}
        featuredProducts={featuredProducts}
      />
    );
    
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Unable to Load Subscription Data
          </h1>
          <p className="text-gray-600 mb-4">
            We're having trouble loading the subscription boxes. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#E84A25] text-white px-6 py-2 rounded-lg hover:bg-[#d43d1a]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}

export const metadata: Metadata = {
  title: 'African Snack Subscription Box | Start Your Snack Safari',
  description: 'Choose from our selection of authentic African snack boxes. Perfect as a gift or for yourself. Multiple duration options with great savings.',
  keywords: 'african snacks, subscription box, gift, snacks, africa, monthly box'
};
