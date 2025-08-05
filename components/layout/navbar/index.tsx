import CartModal from 'components/cart/modal';
import LogoSquare from 'components/logo-square';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  Bars3Icon,
  BuildingStorefrontIcon,
  CubeIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';
import UserMenu from './user-menu';

export async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');
  
  // Sub-navigation categories
  const subCategories = [
    { title: 'Collections', path: '/collection' },
    { title: 'Store', path: '/store' },
    { title: 'Snack Boxes', path: '/get-started' },
    { title: 'Drinks', path: '/collection/drinks' },
    { title: 'Game - Nyumly 54', path: '/games' },
  ];

  return (
    <div className="w-full relative">
      {/* Main Header */}
      <nav className="relative w-full bg-white backdrop-blur-xl border-b border-slate-200/50  sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 lg:gap-6">
              {/* Mobile Menu - Only visible on mobile */}
              <div className="block lg:hidden">
                <Suspense fallback={<MenuSkeleton />}>
                  <MobileMenu menu={menu} />
                </Suspense>
              </div>

              {/* Logo - Responsive positioning */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:top-0 lg:left-0 lg:translate-x-0 lg:translate-y-0">
                <Link
                  href="/"
                  prefetch={true}
                  className="flex items-center group transition-transform duration-200 hover:scale-105"
                >
                  <LogoSquare size="sm" />
                </Link>
              </div>

              {/* Desktop Navigation - Hidden on mobile */}
              <div className="hidden lg:flex items-center">
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-6" />
                <div className="flex items-center gap-8">
                  {subCategories.slice(0, 2).map((item) => (
                    <Link
                      key={item.title}
                      href={item.path}
                      prefetch={true}
                      className="relative text-sm  text-secondary   dark:hover:text-white transition-colors group"
                    >
                      {item.title}
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-slate-900 dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER SECTION - Desktop Search */}
            <div className="hidden lg:flex flex-1 justify-center max-w-lg mx-8">
              <div className="w-full relative">
                <Suspense fallback={<SearchSkeleton />}>
                  <Search />
                </Suspense>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2 lg:gap-4">
              
              {/* User Menu */}
              <div className="relative">
                <UserMenu />
              </div>

              {/* Cart */}
              <div className="relative">
                <CartModal />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sub Navigation Categories */}
      <div className="bg-primary">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <ul className="flex  items-center gap-6 lg:gap-8 overflow-x-auto scrollbar-hide py-3">
              {subCategories.map((item, index) => (
                <li key={item.title} className="flex-shrink-0">
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="relative group flex items-center gap-2 text-sm  text-white hover:text-gray-200 transition-all duration-200 whitespace-nowrap"
                  >
                    <CategoryIcon index={index} />
                    <span className='text-sm text-white'>{item.title}</span>
                    
                    <span className="absolute inset-x-0 -bottom-3 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay - Hidden by default */}
      <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 transform -translate-y-full opacity-0 invisible transition-all duration-300 z-40">
        <div className="p-4">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function CategoryIcon({ index }: { index: number }) {
  const icons = [
    <Bars3Icon key="collections" className="w-4 h-4 text-white" />, // Collections
    <BuildingStorefrontIcon key="store" className="w-4 h-4 text-white" />, // Store
    <CubeIcon key="snacks" className="w-4 h-4 text-white" />, // Snack Boxes
    <BeakerIcon key="drinks" className="w-4 h-4 text-white" />, // Drinks
    <PuzzlePieceIcon key="games" className="w-4 h-4 text-white" />, // Games
    
  ];
  
  return icons[index] || icons[0];
}

// Loading Skeleton Components
function MenuSkeleton() {
  return (
    <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
  );
}