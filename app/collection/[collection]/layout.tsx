import Footer from 'components/layout/footer';
import Collections from 'components/layout/search/collections';
import FilterItemDropdown from 'components/layout/search/filter/dropdown';
import { sorting } from 'lib/constants';
import ChildrenWrapper from '../children-wrapper';
import { Suspense } from 'react';

export default function CollectionLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-[--breakpoint-2xl] px-4">
        {/* Top Filter Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-neutral-200 dark:bg-black/95 dark:border-neutral-800 -mx-4 px-4 py-4 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            {/* Collections Dropdown */}
            <div className="flex-1 min-w-0 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                </svg>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Filter by Collection</span>
              </div>
              <Suspense fallback={<div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />}>
                <Collections />
              </Suspense>
            </div>

            {/* Sort Dropdown */}
            <div className="flex-shrink-0 w-full sm:w-64">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sort Products</span>
              </div>
              <Suspense fallback={<div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />}>
                <FilterItemDropdown list={sorting} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="min-h-screen pb-8">
          <Suspense fallback={<ContentSkeleton />}>
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Loading skeletons for better UX
function FilterSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex-shrink-0 h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse"
        />
      ))}
    </div>
  );
}
function ContentSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="space-y-3">
          <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}