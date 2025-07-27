// app/(site)/account/page.tsx
import { getCustomer, getCustomerOrders } from 'lib/customer-server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AccountClient from './account-client';

// Server Component that pre-fetches data
export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>; // Update type to Promise
}) {
  // Await searchParams before accessing properties
  const resolvedSearchParams = await searchParams;
  
  // Get auth token from cookies (server-side)
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customerAccessToken')?.value;

  // Redirect to login if not authenticated
  if (!customerAccessToken) {
    redirect('/auth/login');
  }

  // Parallel data fetching on server
  const [customer, orders] = await Promise.allSettled([
    getCustomer(),
    getCustomerOrders(10)
  ]);

  // Handle auth failures
  if (customer.status === 'rejected' || !customer.value) {
    redirect('/auth/login');
  }

  const fetchOrdersServer = async () => {
    'use server';
    return await getCustomerOrders(10);
  };
  
  // Pass data to client component including the access token
  return (
    <AccountClient
      initialCustomer={customer.value}
      initialOrders={orders.status === 'fulfilled' ? orders.value : []}
      initialOrdersError={orders.status === 'rejected' ? orders.reason?.message : null}
      initialTab={resolvedSearchParams.tab} // Use the awaited value
      customerAccessToken={customerAccessToken} // Pass token to client
      fetchOrdersServer={fetchOrdersServer}
    />
  );
}