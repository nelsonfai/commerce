'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface BoxActionButtonProps {
  boxName?: string;
  to?: string;
  purchaseType?: 'subscription' | 'one-time';
  className?: string;
  children?: ReactNode;
  route?: string;
}

export default function BoxActionButton({
  boxName,
  to = '',
  purchaseType = 'subscription',
  className = '',
  children,
  route
}: BoxActionButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (route) {
      router.push(route);
    } else if (to) {
      router.push(to);
    } else if (boxName) {
      // Default behavior: construct purchase route
      const params = new URLSearchParams({
        box: boxName.toLowerCase().replace(/\s+/g, '-'),
        type: purchaseType
      });
      router.push(`/purchase?${params.toString()}`);
    }
  };

  const defaultClassName = `rounded-lg px-4 py-2 text-sm font-bold text-white transition hover:bg-opacity-90 cursor-pointer bg-primary`;

  return (
    <button
      className={className || defaultClassName}
      onClick={handleClick}
    >
      {children || "Buy Now"}
    </button>
  );
}