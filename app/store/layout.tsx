import { FilterLayout } from 'components/layout/filter-layout';
//import ChildrenWrapper from './children-wrapper';

export default function SearchLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterLayout
      showCollections={false}
      showSorting={false}
    >
      <>{children}</>
    </FilterLayout>
  );
}