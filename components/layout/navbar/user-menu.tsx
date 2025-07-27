'use client';

import { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useAuthContext } from 'contexts/AuthContext';

// Simple avatar component that generates initials from name or email
function UserAvatar({ user }: { user: any }) {
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
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white text-sm font-medium">
      {getInitials()}
    </div>
  );
}

export default function UserMenu() {
  const { isAuthenticated, customer, logout } = useAuthContext();

  if (!isAuthenticated) {
    return (
      <Link
        href="/auth/login"
        className="block p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </Link>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors">
        <UserAvatar user={customer} />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {customer?.firstName || customer?.displayName || 'User'}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {customer?.email}
            </p>
          </div>
          
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <Link
                  href="/account"
                  className={`${
                    focus ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                >
                  My Account
                </Link>
              )}
            </MenuItem>
            
            <MenuItem>
              {({ focus }) => (
                <Link
                  href="/account/orders"
                  className={`${
                    focus ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                >
                  Order History
                </Link>
              )}
            </MenuItem>
            
            <MenuItem>
              {({ focus }) => (
                <Link
                  href="/account/addresses"
                  className={`${
                    focus ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                >
                  Addresses
                </Link>
              )}
            </MenuItem>
            
            <div className="border-t border-gray-100">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      focus ? 'bg-gray-100' : ''
                    } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                  >
                    Sign Out
                  </button>
                )}
              </MenuItem>
            </div>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}