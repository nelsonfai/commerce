// app/search/layout.tsx
import { Suspense } from 'react';
import { FilterLayout } from 'components/layout/filter-layout';
import ChildrenWrapper from './children-wrapper';

// Loading component for the suspense fallback
function SearchLayoutLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function SearchLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<SearchLayoutLoading />}>
      <FilterLayout
        showCollections={true}
        showSorting={true}
      >
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </FilterLayout>
    </Suspense>
  );
}