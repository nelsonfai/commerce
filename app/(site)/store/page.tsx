import type { Metadata } from 'next';
import Link from 'next/link';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getCollectionProducts, getCollections } from 'lib/shopify';

export const metadata: Metadata = {
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
    <div className="space-y-12 pt-6 overflow-x-hidden">

      {/* Store Intro Section */}
      <div className="text-center space-y-6 py-6 ">
        <div className="space-y-4 ">
          <h1 className="text-4xl font-bold tracking-tight text-secondary dark:text-white">
            Start Your Snack Safari
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We have arrange it for you  sweet, spicy, crunchy, and everything in between.
            Pick your vibe, pick your region, and shop easy.
          </p>
        </div> 
        <div className=' w-full h-96 mx-auto bg-gray-200 rounded-lg'>
        <div 
              className=" w-full rounded-lg h-full bg-cover bg-center transition-all "
              style={{
                backgroundImage: 'url("/hero/hero_3.png")'            }}
            />  
        </div>
      </div>

      {/* Category Buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Shop by Category — What Are You Looking ?
        </h2>
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2 min-w-max">
            {collections.map((category) => (
              <Link
                key={category.handle}
                href={`/collection/${category.handle}`}
                className="flex justify-center items-center px-12 py-8 bg-secondary rounded-md text-md text-white border border-gray-300 whitespace-nowrap">
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Collections Section */}
      {collectionsWithItems.map((collection) => (
        <section key={collection.handle} className="space-y-6 border-t border-gray-100 pt-6">
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

          {/* Products Grid - Horizontal Scroll - FIXED */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-2 min-w-max">
              {collection.products.map((product) => (
            


<div key={product.id} className="w-56 sm:w-80 flex-shrink-0 overflow-hidden relative">
  <div className="w-full max-w-full">
    <ProductGridItems products={[product]} />
  </div>
</div>
              ))}
            </div>
          </div>

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