'use server';
import { TAGS } from 'lib/constants';
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  getCustomerAccessToken,
  associateCustomerWithCart,
  updateCart
} from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
  attributes?: { key: string; value: string }[]
) {
  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    const lineItem = {
      merchandiseId: selectedVariantId,
      quantity: 1,
      ...(attributes && attributes.length > 0 && { attributes })
    };
    
    await addToCart([lineItem]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
    attributes?: { key: string; value: string }[];
  }
) {
  const { merchandiseId, quantity, attributes } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        const updateData = {
          id: lineItem.id,
          merchandiseId,
          quantity,
          ...(attributes && attributes.length > 0 && { attributes })
        };
        
        await updateCart([updateData]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      const addData = {
        merchandiseId,
        quantity,
        ...(attributes && attributes.length > 0 && { attributes })
      };
      
      await addToCart([addData]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}


// Updated redirect to checkout with customer association



export async function redirectToCheckout() {
  // Check if user is logged in
  const customerAccessToken = await getCustomerAccessToken();
  
  if (customerAccessToken) {
    try {
      // Associate customer with cart before checkout
      await associateCustomerWithCart(customerAccessToken);
      revalidateTag(TAGS.cart);
    } catch (error) {
      console.error('Error associating customer with cart:', error);
    }
  }

  const cart = await getCart();
  if (!cart) {
    // If no cart, redirect to cart page
    return
    redirect('/cart');
  }

  redirect(cart.checkoutUrl);
}

export async function createCartAndSetCookie() {
  try {
    const customerAccessToken = await getCustomerAccessToken();
    
    let cart;
    if (customerAccessToken) {
      // Create cart with customer association if logged in
      cart = await createCartWithCustomer(customerAccessToken);
    } else {
      // Create regular cart if not logged in
      cart = await createCart();
    }
    
    (await cookies()).set('cartId', cart.id!);
    return cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    // Fallback to regular cart creation
    const cart = await createCart();
    (await cookies()).set('cartId', cart.id!);
    return cart;
  }
}

// New action to manually associate customer with existing cart (useful when user logs in)
export async function associateCartWithLoggedInCustomer() {
  try {
    const customerAccessToken = await getCustomerAccessToken();
    if (!customerAccessToken) {
      return 'User not logged in';
    }

    const cart = await getCart();
    if (!cart) {
      return 'No cart found';
    }

    await associateCustomerWithCart(customerAccessToken);
    revalidateTag(TAGS.cart);
    
    return 'success';
  } catch (error) {
    console.error('Error associating cart with customer:', error);
    return 'Error associating cart with customer';
  }
}

function createCartWithCustomer(customerAccessToken: string): any {
  throw new Error('Function not implemented.');
}
