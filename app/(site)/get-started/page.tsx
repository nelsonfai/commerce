// app/subscription-box/page.tsx
import React from 'react';
import { getCollectionProducts } from 'lib/shopify';
import SubscriptionBoxClient from './getstarted-client';
import { Metadata } from 'next';

export default async function SubscriptionBoxPage(): Promise<React.JSX.Element> {
  try {
    // Fetch subscription bundles and featured products
    const [subscriptionBundles, featuredProducts] = await Promise.all([
      getCollectionProducts({ collection: 'subscription-bundles' }),
      getCollectionProducts({ collection: 'featured-snacks' })
    ])


    if (!subscriptionBundles?.length) {
      console.warn('No subscription bundles found');
    }

    return (
      <SubscriptionBoxClient 
        subscriptionBoxes={subscriptionBundles || []}
        featuredProducts={featuredProducts || []}
      />
    );
        
  } catch (error) {
    console.error('Error loading subscription data:', error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Unable to Load Subscription Data
          </h1>
          <p className="text-gray-600 mb-6">
            We're having trouble loading the subscription boxes. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#E84A25] text-white px-6 py-3 rounded-lg hover:bg-[#d43d1a] transition-colors"
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