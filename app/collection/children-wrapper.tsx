'use client';

import { useSearchParams } from 'next/navigation';
import { Fragment, Suspense } from 'react';

export default function ChildrenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <WrapperInner>{children}</WrapperInner>
    </Suspense>
  );
}

function WrapperInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  return <Fragment key={searchParams.get('q')}>{children}</Fragment>;
}
