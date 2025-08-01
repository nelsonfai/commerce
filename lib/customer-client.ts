// lib/customer-client.ts
import { shopifyFetch } from './shopify';
import type { Customer, Order, Address } from './customer-server';

// Re-export types for convenience
export type { Customer, Order, Address };

// Client-safe GraphQL queries and mutations
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

// Client-safe function to update customer (requires token to be passed)
export async function updateCustomerClient(
  customerAccessToken: string,
  updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }
) {
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

  return res.body.data.customerUpdate.customer;
}

// Client-safe function to get customer orders (requires token to be passed)
export async function getCustomerOrdersClient(
  customerAccessToken: string,
  first: number = 10
): Promise<Order[]> {
  const res: { body: any } = await shopifyFetch({
    query: customerOrdersQuery,
    variables: { customerAccessToken, first }
  });

  if (!res.body.data.customer) {
    throw new Error('Customer not found');
  }

  return res.body.data.customer.orders.edges.map((edge: any) => ({
    ...edge.node,
    lineItems: edge.node.lineItems.edges.map((item: any) => item.node)
  }));
}