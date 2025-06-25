import clsx from 'clsx';
import { Suspense } from 'react';
import { getCollections } from 'lib/shopify';
import FilterList from './filter';

async function CollectionList() {
  const collections = await getCollections();
  return <FilterList list={collections} title="" />;
}

export default function Collections() {
  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 h-9 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"
              />
            ))}
          </div>
        }
      >
        <CollectionList />
      </Suspense>
    </div>
  );
}