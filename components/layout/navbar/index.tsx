import CartModal from 'components/cart/modal';
import LogoSquare from 'components/logo-square';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';

export async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');



  // Sub-navigation categories
  const subCategories = [
    { title: 'Subscription Box', path: '/subscription' },
    { title: 'All Snacks', path: '/all-snacks' },
    { title: 'Drinks', path: '/drinks' },
    { title: 'Chips & Savory', path: '/chips-savory' },
    { title: 'Candy & Sweets', path: '/candy-sweets' },
    { title: 'Cookies, Crackers & Bakery', path: '/cookies-crackers' },
    { title: 'Ramen & Instant Food', path: '/ramen-instant' },
    { title: 'Other', path: '/other' }
  ];

  return (
    <div className="w-full">
      {/* Main Header */}
      <nav className="relative w-full py-4 min-h-[64px] bg-white border-b border-gray-100">
  <div className="flex items-center justify-between px-4 md:px-6">

    {/* LEFT SECTION */}
    <div className="flex items-center space-x-2 md:space-x-4">
      {/* Mobile Menu - Only visible on mobile */}
      <div className="block md:hidden">
        <Suspense>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>

      {/* Logo - Centered on mobile, left on desktop */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:top-0 md:left-0 md:translate-x-0 md:translate-y-0 flex items-center">
        <Link
          href="/"
          prefetch={true}
          className="flex items-center">
          <LogoSquare size="sm" />
        </Link>
      </div>
    </div>

    {/* RIGHT SECTION */}
    <div className="flex items-center space-x-1 md:space-x-4">
      {/* Desktop Search Bar */}
      <div className="hidden md:block max-w-md w-80">
        <Suspense fallback={<SearchSkeleton />}>
          <div className="relative">
            <Search />
          </div>
        </Suspense>
      </div>

      {/* Account */}
      <Link
        href="/account"
        className="block p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </Link>

      {/* Cart */}
      <CartModal />
    </div>
  </div>
</nav>



      {/* Sub Navigation Categories */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="px-4 lg:px-6">
          <ul className="flex items-center space-x-4 md:space-x-6 overflow-x-auto">
            {subCategories.map((item) => (
              <li key={item.title} className="flex-shrink-0">
                <Link
                  href={item.path}
                  prefetch={true}
                  className="block py-3 text-xs md:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}