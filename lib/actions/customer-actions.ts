// lib/actions/customer-actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { updateCustomer, customerLogout } from '../customer-server';

// Server action for updating customer profile
export async function updateCustomerAction(updates: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}) {
  try {
    const updatedCustomer = await updateCustomer(updates);
    return { success: true, customer: updatedCustomer };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile' 
    };
  }
}

// Server action for customer logout
export async function customerLogoutAction() {
  try {
    await customerLogout();
    redirect('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
    // Still redirect even if logout fails
    redirect('/auth/login');
  }
}

// Server action to refresh customer data
export async function refreshCustomerDataAction() {
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customerAccessToken')?.value;
  
  if (customerAccessToken) {
    // Invalidate customer cache
    revalidateTag(`customer-${customerAccessToken.slice(-8)}`);
    revalidateTag(`orders-${customerAccessToken.slice(-8)}`);
  }
}