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
    <div className="min-h-screen ">
      <div className=" px-4 sm:px-6 lg:px-8 py-8 space-y-16">

        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-light text-secondary dark:text-white tracking-tight">
              Start Your Snack Safari
            </h1>
            <p className="text-lg text-black  max-w-2xl mx-auto font-light leading-relaxed">
              Sweet, spicy, crunchy, and everything in between.
              Pick your vibe, pick your region, and shop easy.
            </p>
          </div>
          
          {/* Hero Image */}
          <div className="relative w-full h-80 sm:h-96 mx-auto rounded-2xl overflow-hidden shadow-lg">
            <div 
              className="w-full h-full bg-cover bg-center transition-all duration-500 hover:scale-105"
              style={{
                backgroundImage: 'url("/hero/hero_3.png")'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        {/* Category Navigation */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-light text-secondary">
            Shop by Category
          </h2>
          
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4 min-w-max">
              {collections.map((category) => (
                <Link
                  key={category.handle}
                  href={`/collection/${category.handle}`}
                  className="group flex-shrink-0 px-8 py-4 bg-white rounded-xl border border-slate-200  transition-all duration-200 "
                >
                  <span className="text-sm font-medium text-secondary  dark:group-hover:text-white whitespace-nowrap">
                    {category.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-16">
          {collectionsWithItems.map((collection, index) => (
            <section key={collection.handle} className="space-y-8">
              {/* Collection Header */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-light text-secondary dark:text-white tracking-tight">
                    {collection.title}
                  </h2>
                  {collection.description && (
                    <p className="text-slate-600 dark:text-slate-300 font-light">
                      {collection.description}
                    </p>
                  )}
                </div>
                         
                {/* View All Button */}
                <Link
                  href={`/collection/${collection.handle}`}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-secondary  text-white  rounded-full text-sm font-medium  "
                >
                  View All
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

              {/* Section Divider */}
              {index < collectionsWithItems.length - 1 && (
                <div className="pt-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Empty State */}
        {collectionsWithItems.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-slate-900 dark:text-white">
              No products found
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-light">
              There are currently no products available in any collection.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}