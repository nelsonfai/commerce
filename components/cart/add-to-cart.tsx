'use client';

import { PlusIcon, MinusIcon,ShoppingCartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem, updateItemQuantity } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useActionState, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { useCart } from './cart-context';

function SubmitButton({ 
  type, 
  compact = false 
}: { 
  type: 'plus' | 'minus'; 
  compact?: boolean;
}) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      disabled={pending}
      className={clsx(
        'flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black font-bold transition-colors',
        {
          'w-8 h-8 text-sm': compact,
          'w-9 h-9 text-base': !compact,
          'cursor-not-allowed opacity-60': pending,
          'hover:bg-gray-100 dark:hover:bg-gray-800': !pending,
          'rounded-r-none border-r-0': type === 'minus',
          'rounded-l-none border-l-0': type === 'plus'
        }
      )}
    >
      {type === 'plus' ? (
        <PlusIcon className={compact ? "h-3 w-3" : "h-4 w-4"} />
      ) : (
        <MinusIcon className={compact ? "h-3 w-3" : "h-4 w-4"} />
      )}
    </button>
  );
}

function EditItemQuantityButton({
  merchandiseId,
  currentQuantity,
  type,
  optimisticUpdate,
  compact = false
}: {
  merchandiseId: string;
  currentQuantity: number;
  type: 'plus' | 'minus';
  optimisticUpdate: any;
  compact?: boolean;
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId,
    quantity: type === 'plus' ? currentQuantity + 1 : currentQuantity - 1
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} compact={compact} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

function QuantityControls({
  merchandiseId,
  quantity,
  optimisticUpdate,
  compact = false
}: {
  merchandiseId: string;
  quantity: number;
  optimisticUpdate: any;
  compact?: boolean;
}) {
  const containerClasses = clsx(
    "flex items-center rounded-full border border-neutral-200 dark:border-neutral-700",
    {
      'h-8': compact,
      'h-9': !compact
    }
  );

  return (
    <div className={containerClasses}>
      <EditItemQuantityButton
        merchandiseId={merchandiseId}
        currentQuantity={quantity}
        type="minus"
        optimisticUpdate={optimisticUpdate}
        compact={compact}
      />
      
      <div className={clsx(
        "flex items-center justify-center border-t border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black font-medium",
        {
          'w-8 h-8 text-sm': compact,
          'w-12 h-9 text-base': !compact
        }
      )}>
        {quantity}
      </div>
      
      <EditItemQuantityButton
        merchandiseId={merchandiseId}
        currentQuantity={quantity}
        type="plus"
        optimisticUpdate={optimisticUpdate}
        compact={compact}
      />
    </div>
  );
}

function AddToCartButton({
  availableForSale,
  selectedVariantId,
  compact = false
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  compact?: boolean;
}) {
  const { pending } = useFormStatus();
  
  const buttonClasses = clsx(
    "relative bg-[#f4b625] rounded-lg text-[#181611] font-bold hover:bg-[#e4a615] transition-colors cursor-pointer flex items-center justify-center",
    {
      // Compact mode (icon only)
      'w-10 h-10': compact,
      // Full mode with responsive behavior
      'px-4 py-2 sm:px-4 sm:py-2': !compact,
      'px-0 py-0 sm:w-auto sm:h-auto sm:px-4 sm:py-2': !compact,
      'opacity-60 cursor-not-allowed': pending
    }
  );

  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        {compact ? (
          <PlusIcon className="h-5 w-5" />
        ) : (
          <>
            <span className="sm:hidden">
              <PlusIcon className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">Out Of Stock</span>
          </>
        )}
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        {compact ? (
          <PlusIcon className="h-5 w-5" />
        ) : (
          <>
            <span>
              <PlusIcon className="h-5 w-5" />
            </span>
            <span>Add To Cart</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="submit"
      aria-label="Add to cart"
      disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': !pending
      })}
    >
      {compact ? (
        <PlusIcon className="h-5 w-5" />
      ) : (
        <>
          <span >
            <ShoppingCartIcon className="h-5 w-5 " />
          </span>
          <span className="ml-2">{pending ? 'Adding...' : ' Add To Cart'}</span>
        </>
      )}
    </button>
  );
}

export function AddToCart({
  product,
  compact = false
}: {
  product: Product;
  compact?: boolean;
  className?: string
}) {
  const { variants, availableForSale } = product;
  const { updateCartItem, cart } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);

  // Find current quantity in cart for this variant
  const cartItem = useMemo(() => {
    if (!cart || !selectedVariantId) return null;
    return cart.lines.find(line => line.merchandise.id === selectedVariantId);
  }, [cart, selectedVariantId]);

  const currentQuantity = cartItem?.quantity || 0;

  // Show quantity controls if item is already in cart
  if (currentQuantity > 0 && selectedVariantId) {
    return (
      <div className="flex items-center">
        <QuantityControls
          merchandiseId={selectedVariantId}
          quantity={currentQuantity}
          optimisticUpdate={updateCartItem}
          compact={compact}
        />
        <p aria-live="polite" className="sr-only" role="status">
          {message}
        </p>
      </div>
    );
  }

  // Show add to cart button if item is not in cart
  return (
    <form action={addItemAction}>
      <AddToCartButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        compact={compact}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}