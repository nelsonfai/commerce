import Footer from 'components/layout/footer';
import Collections from 'components/layout/search/collections';
import FilterItemDropdown from 'components/layout/search/filter/dropdown';
import { sorting } from 'lib/constants';
import { Suspense } from 'react';
import ChildrenWrapper from './children-wrapper';

export default function CollectionLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Modern Filter Header */}
        <div className=" z-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              {/* Page Title & Breadcrumb */}
              <div className="flex-1 ">
                <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
                  Browse Collections
                </h1>
                <p className="text-slate-600 mt-1 font-light">
                  Discover our curated selection of premium products
                </p>
              </div>
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 min-w-0">
              {/* Collections Filter */}
              <div className="flex-1 sm:min-w-[240px] lg:min-w-[280px]">
                <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide">
                  Collection
                </label>
                <div className="relative">
                  <Suspense fallback={<FilterSkeleton />}>
                    <Collections />
                  </Suspense>
                </div>
              </div>

              {/* Sort Filter */}
              <div className="flex-shrink-0 w-full sm:w-56 lg:w-64">
                <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide">
                  Sort by
                </label>
                <div className="relative">
                  <Suspense fallback={<FilterSkeleton />}>
                    <FilterItemDropdown list={sorting} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="pb-16">
          <Suspense fallback={<ContentSkeleton />}>
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Suspense>
        </main>
      </div>

      <Footer />
    </div>
  );
}

// Enhanced Loading Skeletons
function FilterSkeleton() {
  return (
    <div className="relative">
      <div className="w-full h-12 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Bar Skeleton */}
      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-slate-200/50">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 hover:shadow-lg transition-all duration-300">
              {/* Image Skeleton */}
              <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Skeleton */}
      <div className="flex justify-center pt-8">
        <div className="h-12 w-32 bg-slate-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
