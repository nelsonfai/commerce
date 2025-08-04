
// app/(site)/search/page.tsx
import type { Metadata } from 'next';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';

export const metadata :Metadata = {
  title: 'Search',
  description: 'Search for products in the Nyumly store.'
};

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  // Await the searchParams promise
  const resolvedSearchParams = searchParams ? await searchParams : {};
  
  const { sort, q: searchValue } = resolvedSearchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });

  // 🔍 Filter out products with tags starting with 'd-'
  const filteredProducts = products.filter(product => {
    return !product.tags?.some(tag => tag.startsWith('d-'));
  });

  const resultsText = filteredProducts.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-4 min-h-[70px]">
          {filteredProducts.length === 0
            ? 'There are no products that match '
            : `Showing ${filteredProducts.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {filteredProducts.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={filteredProducts} />
        </Grid>
      ) : null}
    </>
  );
}
