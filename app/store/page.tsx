import type { Metadata } from 'next';

import Link from 'next/link';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getCollectionProducts, getCollections } from 'lib/shopify';

export const metadata :Metadata = {
  title: 'Store',
  description: 'Browse all products in our store by category.'
};

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StorePage({ searchParams }: PageProps) {
  // Await the searchParams promise
  const resolvedSearchParams = searchParams ? await searchParams : {};
  
  const { sort } = resolvedSearchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // Get all collections
  const collections = await getCollections(false);
  
  // Get products for each collection (max 8 per collection)
  const collectionsWithProducts = await Promise.all(
    collections.map(async (collection) => {
      const products = await getCollectionProducts({
        collection: collection.handle,
        sortKey,
        reverse,
        first: 8
      });
            
      return {
        ...collection,
        products: products
      };
    })
  );

  // Filter out collections with no products
  const collectionsWithItems = collectionsWithProducts.filter(
    (collection) => collection.products.length > 0
  );

  return (
    <div className="space-y-12">
      {collectionsWithItems.map((collection) => (
        <section key={collection.handle} className="space-y-6">
          {/* Collection Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {collection.title}
              </h2>
              {collection.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {collection.description}
                </p>
              )}
            </div>
            
            {/* View All Button */}
            <Link
              href={`/collection/${collection.handle}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              View All
              <svg
                className="ml-2 -mr-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {/* Products Grid */}
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <ProductGridItems products={collection.products} />
          </Grid>
        </section>
      ))}

      {/* Empty State */}
      {collectionsWithItems.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            No products found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            There are currently no products available in any collection.
          </p>
        </div>
      )}
    </div>
  );
}