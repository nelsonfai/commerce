'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Customer, Order } from 'lib/customer-client';
import { updateCustomerAction, customerLogoutAction } from 'lib/actions/customer-actions';
import { OrdersTab, ProfileTab, AddressTab } from './tabs';
import {
    CubeIcon as PackageIcon,    
    UserIcon,
    MapPinIcon as LocationIcon,
    ArrowRightStartOnRectangleIcon as LogoutIcon,
    PencilIcon as EditIcon,
  } from '@heroicons/react/24/outline';

interface AccountClientProps {
  initialCustomer: Customer;
  initialOrders: Order[];
  initialOrdersError: string | null;
  initialTab?: string;
  customerAccessToken: string;
  fetchOrdersServer: () => Promise<Order[]>;
}

export default function AccountClient({
  initialCustomer,
  initialOrders,
  initialOrdersError,
  initialTab = 'profile',
  customerAccessToken,
  fetchOrdersServer
}: AccountClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // State management
  const [customer, setCustomer] = useState(initialCustomer);
  const [orders, setOrders] = useState(initialOrders);
  const [ordersError, setOrdersError] = useState(initialOrdersError);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Handle tab changes with URL updates
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    startTransition(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      router.push(url.pathname + url.search, { scroll: false });
    });
  };

  // Handle logout using server action
  const handleLogout = async () => {
    startTransition(async () => {
      await customerLogoutAction();
    });
  };

  // Update profile using server action with optimistic updates
  const updateProfile = async (updates: Partial<Customer>) => {
    const previousCustomer = customer;
    
    // Optimistic update
    setCustomer(prev => ({ ...prev, ...updates }));

    try {
      const result = await updateCustomerAction(updates);
      if (!result.success) {
        // Revert on error
        setCustomer(previousCustomer);
        throw new Error(result.error);
      }
      // Update with server response
      setCustomer(prev => ({ ...prev, ...result.customer }));
    } catch (error) {
      // Revert on error
      setCustomer(previousCustomer);
      throw error;
    }
  };

  // Refresh orders when needed using client function

    const fetchOrders = async () => {
      try {
        setOrdersError(null);
        const freshOrders = await fetchOrdersServer();
        setOrders(freshOrders);
      } catch (error) {
        setOrdersError(error instanceof Error ? error.message : 'Failed to fetch orders');
      }
    };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'orders', label: 'Orders', icon: PackageIcon },
    { id: 'addresses', label: 'Addresses', icon: LocationIcon },
  ];

  return (
    <div className="min-h-screen md:p-8">
      <div className="max-w-7xl p-2">
        {/* Tabs */}
        <div className="bg-white border border-gray-100 rounded-lg md:rounded-2xl mb-6 md:mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex px-2 md:px-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    disabled={isPending}
                    className={`py-4 md:py-6 px-3 md:px-6 border-b-2 font-medium text-sm whitespace-nowrap flex items-center justify-center md:justify-start gap-0 md:gap-3 transition-colors duration-200 flex-1 md:flex-initial disabled:opacity-50 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                    }`}
                    title={tab.label}
                    aria-label={tab.label}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              isLoading={false} // Already loaded on server
              error={ordersError}
              fetchOrders={fetchOrders}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              customer={customer}
              updateProfile={updateProfile}
              onLogout={handleLogout}
            />
          )}
          {activeTab === 'addresses' && (
            <AddressTab
              customer={customer}
            />
          )}
        </div>
      </div>
    </div>
  );
}