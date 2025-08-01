// lib/customer.ts
import { cookies } from 'next/headers';
import { shopifyFetch } from './shopify';
import { TAGS } from 'lib/constants';
import { revalidateTag, unstable_cacheTag as cacheTag, unstable_cache } from 'next/cache';

// Types for customer data
export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  phone?: string;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
  addresses: Address[];
  defaultAddress?: Address;
}

export interface Address {
  id: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
  phone?: string;
}

export interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalTax: {
    amount: string;
    currencyCode: string;
  };
  lineItems: OrderLineItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface OrderLineItem {
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    image?: {
      url: string;
      altText?: string;
    };
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}


interface ShopifyResponse {
  body: {
    data: {
      customerCreate: {
        customer: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
        };
        customerUserErrors: {
          field: string;
          message: string;
          code: string;
        }[];
      };
    };
  };
}

// GraphQL queries for customer operations
const customerQuery = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      displayName
      phone
      acceptsMarketing
      createdAt
      updatedAt
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            country
            zip
            phone
          }
        }
      }
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
    }
  }
`;

const customerOrdersQuery = `
  query customerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            fulfillmentStatus
            financialStatus
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            shippingAddress {
              firstName
              lastName
              company
              address1
              address2
              city
              province
              country
              zip
              phone
            }
            billingAddress {
              firstName
              lastName
              company
              address1
              address2
              city
              province
              country
              zip
              phone
            }
          }
        }
      }
    }
  }
`;

const customerCreateMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const customerAccessTokenCreateMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const customerAccessTokenDeleteMutation = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

const customerUpdateMutation = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Customer service functions
export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}) {
  
  const res: { body: any } = await shopifyFetch({
    query: customerCreateMutation,
    variables: {
      input
    }});

  if (res.body.data.customerCreate.customerUserErrors.length > 0) {
    throw new Error(res.body.data.customerCreate.customerUserErrors[0].message);
  }

  return res.body.data.customerCreate.customer;
}

export async function customerLogin(email: string, password: string) {
  const res: { body: any } = await shopifyFetch({
    query: customerAccessTokenCreateMutation,
    variables: {
      input: { email, password }
    }
  });

  if (res.body.data.customerAccessTokenCreate.customerUserErrors.length > 0) {
    throw new Error(res.body.data.customerAccessTokenCreate.customerUserErrors[0].message);
  }

  const { accessToken, expiresAt } = res.body.data.customerAccessTokenCreate.customerAccessToken;
  
  // Set the access token in cookies
  const cookieStore = await cookies();
  cookieStore.set('customerAccessToken', accessToken, {
    expires: new Date(expiresAt),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return { accessToken, expiresAt };
}

export async function customerLogout() {
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customerAccessToken')?.value;

  if (customerAccessToken) {
    // Revoke the token on Shopify's end
    await shopifyFetch({
      query: customerAccessTokenDeleteMutation,
      variables: { customerAccessToken }
    });

    // Remove from cookies
    cookieStore.delete('customerAccessToken');
  }
}


// Helper function to check if customer is authenticated
export async function isCustomerAuthenticated(): Promise<boolean> {
  const customer = await getCustomer();
  return customer !== null;
}


// Enhanced getCustomer with caching
export async function getCustomer(): Promise<Customer | null> {
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customerAccessToken')?.value;

  if (!customerAccessToken) {
    return null;
  }

  try {
    // Cache customer data for 5 minutes with token-specific key
    const cachedCustomer = unstable_cache(
      async (token: string) => {
        const res: { body: any } = await shopifyFetch({
          query: customerQuery,
          variables: { customerAccessToken: token }
        });

        if (!res.body.data.customer) {
          return null;
        }

        const customer = res.body.data.customer;
        return {
          ...customer,
          addresses: customer.addresses.edges.map((edge: any) => edge.node)
        };
      },
      [`customer-${customerAccessToken.slice(-8)}`], // Use last 8 chars as cache key
      {
        revalidate: 300, // 5 minutes
        tags: [`customer-${customerAccessToken.slice(-8)}`]
      }
    );

    const customer = await cachedCustomer(customerAccessToken);
    
    if (!customer) {
      // Token might be expired, remove it
      cookieStore.delete('customerAccessToken');
      return null;
    }

    return customer;
  } catch (error) {
    console.error('Error fetching customer:', error);
    // Remove invalid token
    cookieStore.delete('customerAccessToken');
    return null;
  }
}

// Enhanced getCustomerOrders with caching
export async function getCustomerOrders(first: number = 10): Promise<Order[]> {
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customerAccessToken')?.value;

  if (!customerAccessToken) {
    throw new Error('Customer not authenticated');
  }

  // Cache orders for 2 minutes
  const cachedOrders = unstable_cache(
    async (token: string, limit: number) => {
      const res: { body: any } = await shopifyFetch({
        query: customerOrdersQuery,
        variables: { customerAccessToken: token, first: limit }
      });

      if (!res.body.data.customer) {
        throw new Error('Customer not found');
      }

      return res.body.data.customer.orders.edges.map((edge: any) => ({
        ...edge.node,
        lineItems: edge.node.lineItems.edges.map((item: any) => item.node)
      }));
    },
    [`orders-${customerAccessToken.slice(-8)}-${first}`],
    {
      revalidate: 120, // 2 minutes
      tags: [`orders-${customerAccessToken.slice(-8)}`]
    }
  );

  return cachedOrders(customerAccessToken, first);
}

// Enhanced updateCustomer with cache invalidation
export async function updateCustomer(updates: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}) {
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customerAccessToken')?.value;

  if (!customerAccessToken) {
    throw new Error('Customer not authenticated');
  }

  const res: { body: any } = await shopifyFetch({
    query: customerUpdateMutation,
    variables: {
      customerAccessToken,
      customer: updates
    }
  });

  if (res.body.data.customerUpdate.customerUserErrors.length > 0) {
    throw new Error(res.body.data.customerUpdate.customerUserErrors[0].message);
  }

  // Invalidate customer cache
  revalidateTag(`customer-${customerAccessToken.slice(-8)}`);

  return res.body.data.customerUpdate.customer;
}