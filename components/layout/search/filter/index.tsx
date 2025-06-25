import { SortFilterItem } from 'lib/constants';
import { Suspense } from 'react';
import FilterItemDropdown from './dropdown';
import { FilterItem } from './item';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        
      
        <FilterItem key={i} item={item} /> 

      
      ))}
    </>
  );
}

export default function FilterList({ 
  list, 
  title 
}: { 
  list: ListItem[]; 
  title?: string; 
}) {
  return (
    <nav className="w-full">
      {title && (
        <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 hidden md:block">
          {title}
        </h3>
      )}
      
      {/* Desktop: Horizontal pill layout for collections, dropdown for sorting */}
      <div className="hidden md:block">
        {title === "" ? (
          // Collections: Horizontal pills
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Suspense fallback={null}>
              <FilterItemList list={list} />
            </Suspense>
          </div>
        ) : (
          // Sorting: Dropdown
          <div className="w-full">
            <Suspense fallback={null}>
              <FilterItemDropdown list={list} />
            </Suspense>
          </div>
        )}
      </div>

      {/* Mobile: Always use dropdown */}
      <div className="md:hidden">
        <Suspense fallback={null}>
          <FilterItemDropdown list={list} />
        </Suspense>
      </div>
    </nav>
  );
}