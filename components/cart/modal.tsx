'use client';

import clsx from 'clsx';
import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon, XMarkIcon,GiftIcon } from '@heroicons/react/24/outline';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCartAndSetCookie, redirectToCheckout } from './actions';
import { useCart } from './cart-context';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col bg-white p-6 text-black md:w-[390px] dark:bg-neutral-900 dark:text-white">
              <div className="flex items-center justify-between mb-6">
                <p className="text-lg font-medium">Cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ShoppingCartIcon className="h-12 w-12 text-neutral-400" />
                  <p className="mt-4 text-neutral-600 dark:text-neutral-400">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col">
                  <div className="flex-1 overflow-auto">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title
                        )
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          }
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );

                        // Helper function to get attribute value
                        const getAttributeValue = (key: string) => {
                          return item.attributes?.find(attr => attr.key === key)?.value;
                        };

                        const isGift = getAttributeValue('Gift') 
                        const subscriptionDuration = getAttributeValue('_internal_subscription_duration');
                        const savedPrice = getAttributeValue('_internal_savings_amount');

                        return (
                          <div
                            key={i}
                            className="flex items-start gap-4 py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
                            <div className="relative">
                              <div className="absolute -top-2 -left-0 z-10 ">
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                              <div className="relative h-16 w-16 overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage
                                      .altText ||
                                    item.merchandise.product.title
                                  }
                                  src={
                                    item.merchandise.product.featuredImage.url
                                  }
                                />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="block group"
                              >
                                <h3 className="font-medium text-sm leading-tight mb-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                                  {item.merchandise.product.title}
                                </h3>
                                {item.merchandise.title !== DEFAULT_OPTION && (
                                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2" hidden>
                                    {item.merchandise.title}
                                  </p>
                                )}
                                
                                {/* Minimalist attribute display */}
                                <div className="space-y-1 mb-3">
                                  {subscriptionDuration && (
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                      1 snack box/month for {subscriptionDuration} months. Paid upfront.
                                    </p>
                                  )}
                                  
                                  {isGift && (
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                                     <GiftIcon className="h-4 w-4 text-neutral-500"/> Gift subscription
                                    </p>
                                  )}
                                  
                                  {savedPrice && savedPrice !== '0' && (
                                    <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                                     Save 
                                        <Price
                                      className="text-xs text-neutral-600 dark:text-neutral-400"
                                      amount={savedPrice}
                                      currencyCode={
                                        item.cost.totalAmount.currencyCode
                                      }
                                    />
                                    </div>
                                  )}
                                </div>
                              </Link>

                              {/* Quantity and Price row */}
                              <div className="flex items-center justify-between">
                                {/* Quantity controls on the left */}
                                <div className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <span className="px-3 py-1 text-sm min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>

                                {/* Price on the right */}
                                <Price
                                  className="text-sm font-medium"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Summary section */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 mt-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Taxes</span>
                        <Price
                          amount={cart.cost.totalTaxAmount.amount}
                          currencyCode={cart.cost.totalTaxAmount.currencyCode}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Shipping</span>
                        <span className="text-neutral-600 dark:text-neutral-400">At checkout</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <span className="font-medium">Total</span>
                        <Price
                          className="font-medium"
                          amount={cart.cost.totalAmount.amount}
                          currencyCode={cart.cost.totalAmount.currencyCode}
                        />
                      </div>
                    </div>

                    <form action={redirectToCheckout} className="mt-6">
                      <CheckoutButton />
                    </form>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
      <XMarkIcon
        className={clsx(
          'h-5 w-5 text-neutral-600 dark:text-neutral-400',
          className
        )}
      />
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-current" /> : 'Checkout'}
    </button>
  );
}