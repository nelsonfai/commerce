// lib/actions/customer-actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { 
  updateCustomer, 
  customerLogout, 
  createCustomerAddress, 
  updateCustomerAddress,
  deleteCustomerAddress 
} from '../customer-server';

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

// Server action to refresh customer data (kept for edge cases)
export async function refreshCustomerDataAction() {
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customerAccessToken')?.value;
   
  if (customerAccessToken) {
    // Invalidate customer cache
    revalidateTag(`customer-${customerAccessToken.slice(-8)}`);
    revalidateTag(`orders-${customerAccessToken.slice(-8)}`);
  }
}

// Optimized address creation - returns full address data
export async function createCustomerAddressAction(addressData: {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}) {
  try {
    const createdAddress = await createCustomerAddress(addressData);
    
    // Light cache invalidation - only if needed for other parts of the app
    const cookieStore = await cookies();
    const customerAccessToken = cookieStore.get('customerAccessToken')?.value;
    if (customerAccessToken) {
      // Only revalidate specific tags that might need updating
      revalidateTag(`customer-${customerAccessToken.slice(-8)}`);
    }
    
    return { success: true, address: createdAddress };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create address'
    };
  }
}

// Optimized address update - returns full address data
export async function updateCustomerAddressAction(addressId: string, addressData: {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}) {
  try {
    const updatedAddress = await updateCustomerAddress(addressId, addressData);
    
    // Light cache invalidation
    const cookieStore = await cookies();
    const customerAccessToken = cookieStore.get('customerAccessToken')?.value;
    if (customerAccessToken) {
      revalidateTag(`customer-${customerAccessToken.slice(-8)}`);
    }
    
    return { success: true, address: updatedAddress };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update address'
    };
  }
}

// Optimized address deletion - minimal server response
export async function deleteCustomerAddressAction(addressId: string) {
  try {
    await deleteCustomerAddress(addressId);
    
    // Light cache invalidation
    const cookieStore = await cookies();
    const customerAccessToken = cookieStore.get('customerAccessToken')?.value;
    if (customerAccessToken) {
      revalidateTag(`customer-${customerAccessToken.slice(-8)}`);
    }
    
    return { success: true, deletedId: addressId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete address'
    };
  }
}