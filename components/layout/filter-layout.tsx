import Footer from 'components/layout/footer';
import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import { sorting } from 'lib/constants';
import { Suspense } from 'react';

interface FilterLayoutProps {
  children: React.ReactNode;
  showCollections?: boolean;
  showSorting?: boolean;
  title?: string;
  description?: string;
}

export function FilterLayout({
  children,
  showCollections = true,
  showSorting = true,
  title,
  description
}: FilterLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        {(title || description) && (
          <div className="pt-8 pb-6">
            <div className="text-center max-w-2xl mx-auto">
              {title && (
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-4 text-lg text-slate-600 font-light leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Modern Filter Header */}
        {(showCollections || showSorting) && (
          <div className="z-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 sm:-mx-6 lg:-mx-8 px-4 sm:px-4 lg:px-8 py-6 mb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              {/* Filter Section */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 flex-1">
                {/* Collections Filter */}
                {showCollections && (
                  <div className="flex-1 sm:min-w-[240px] lg:min-w-[300px]">
                    <label className="block text-xs font-medium text-slate-700 mb-3 uppercase tracking-wide">
                      <span className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                        </svg>
                        Collection
                      </span>
                    </label>
                    <div className="relative max-w-lg">
                      <Suspense fallback={<FilterSkeleton />}>
                        <Collections />
                      </Suspense>
                    </div>
                  </div>
                )}

                {/* Visual Separator */}
                {showCollections && showSorting && (
                  <div className="hidden lg:flex items-end pb-3">
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                  </div>
                )}

                {/* Sort Filter */}
                {showSorting && (
                  <div className="flex-shrink-0 w-full sm:w-56 lg:w-64">
                    <label className="block text-xs font-medium text-slate-700 mb-3 uppercase tracking-wide">
                      <span className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        Sort by
                      </span>
                    </label>
                    <div className="relative">
                      <Suspense fallback={<FilterSkeleton />}>
                        <FilterList list={sorting} title="" />
                      </Suspense>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="pb-16">
          <Suspense fallback={<ContentSkeleton />}>
            {children}
          </Suspense>
        </main>
      </div>

      <Footer />
    </div>
  );
}

// Enhanced Loading Skeletons (No dark mode)
function FilterSkeleton() {
  return (
    <div className="relative overflow-hidden">
      <div className="w-full h-12 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="space-y-8">
      {/* Results Header Skeleton */}
      <div className="flex items-center justify-between p-6 bg-white/60 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-px bg-slate-300" />
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="group">
            <div className="bg-white/80 rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
              {/* Image Skeleton */}
              <div className="aspect-square bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/50 rounded-full animate-pulse" />
                <div className="absolute bottom-4 left-4 w-16 h-6 bg-white/70 rounded-full animate-pulse" />
              </div>

              {/* Content Skeleton */}
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-slate-200 rounded animate-pulse" />
                <div className="flex items-center justify-between pt-3">
                  <div className="h-5 w-20 bg-slate-200 rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-8 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-4 pt-8">
        <div className="h-10 w-20 bg-slate-200 rounded-full animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-10 bg-slate-200 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-20 bg-slate-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
