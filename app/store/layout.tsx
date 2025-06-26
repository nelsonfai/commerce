import { Suspense } from 'react';
import { FilterLayout } from 'components/layout/filter-layout';

// Loading component for the suspense fallback
function StoreLayoutLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function StoreLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<StoreLayoutLoading />}>
      <FilterLayout
        showCollections={false}
        showSorting={false}
      >
        <>{children}</>
      </FilterLayout>
    </Suspense>
  );
}