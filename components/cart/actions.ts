'use server';
import { TAGS } from 'lib/constants';
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
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

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set('cartId', cart.id!);
}