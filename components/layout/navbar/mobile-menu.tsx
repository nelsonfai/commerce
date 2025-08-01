'use client';

import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Menu } from 'lib/shopify/types';
import { useAuthContext } from 'contexts/AuthContext';
import Search, { SearchSkeleton } from './search';

// Simple avatar component for mobile
function MobileUserAvatar({ user }: { user: any }) {
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.displayName) {
      const names = user.displayName.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">
      {getInitials()}
    </div>
  );
}

// Separate component that uses useSearchParams
function MobileMenuContent({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, customer, logout } = useAuthContext();

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  const handleLogout = async () => {
    try {
      await logout();
      closeMobileMenu();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <Bars3Icon className="h-4" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black">
              <div className="p-4">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>

                <div className="mb-4 w-full">
                  <Suspense fallback={<SearchSkeleton />}>
                    <Search />
                  </Suspense>
                </div>

                {/* User Section */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-3 mb-4">
                      <MobileUserAvatar user={customer} />
                      <div>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {customer?.firstName || customer?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {customer?.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <Link
                        href="/auth/login"
                        onClick={closeMobileMenu}
                        className="block w-full text-center py-2 px-4 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>

                {/* Navigation Menu */}
                {menu.length ? (
                  <ul className="flex w-full flex-col mb-6">
                    {menu.map((item: Menu) => (
                      <li
                        className="py-2 text-xl text-black transition-colors hover:text-neutral-500 dark:text-white"
                        key={item.title}
                      >
                        <Link href={item.path} prefetch={true} onClick={closeMobileMenu}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Account Links - Only show if authenticated */}
                {isAuthenticated && (
                  <div className="border-t border-gray-200 pt-4">
                    <ul className="flex w-full flex-col space-y-2">
                      <li>
                        <Link
                          href="/account"
                          onClick={closeMobileMenu}
                          className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                        >
                          My Account
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account?tab=orders"
                          onClick={closeMobileMenu}
                          className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                        >
                          Order History
                        </Link>
                      </li>
                      <li>
                    
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

// Main component that wraps the content in Suspense
export default function MobileMenu({ menu }: { menu: Menu[] }) {
  return (
    <Suspense fallback={
      <button
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <Bars3Icon className="h-4" />
      </button>
    }>
      <MobileMenuContent menu={menu} />
    </Suspense>
  );
}