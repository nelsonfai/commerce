import clsx from 'clsx';

interface PriceRange {
  minVariantPrice: {
    amount: string;
    currencyCode: string;
  };
  maxVariantPrice: {
    amount: string;
    currencyCode: string;
  };
}

interface PriceProps {
  amount?: string;
  className?: string;
  currencyCode?: string;
  currencyCodeClassName?: string;
  priceRange?: PriceRange;
  showRange?: boolean;
}

const Price = ({
  amount,
  className,
  currencyCode = 'USD',
  currencyCodeClassName,
  priceRange,
  showRange = false,
  ...rest
}: PriceProps & React.ComponentProps<'p'>) => {
  // If priceRange is provided and showRange is true, handle range display
  if (priceRange && showRange) {
    const minPrice = priceRange.minVariantPrice;
    const maxPrice = priceRange.maxVariantPrice;
    const hasPriceRange = minPrice.amount !== maxPrice.amount;

    if (hasPriceRange) {
      return (
        <div className={clsx("flex items-center gap-2", className)} {...rest}>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white">
            {new Intl.NumberFormat(undefined, {
              style: 'currency',
              currency: minPrice.currencyCode,
              currencyDisplay: 'narrowSymbol'
            }).format(parseFloat(minPrice.amount))}
            <span className={clsx('ml-1 inline', currencyCodeClassName)}>
              {minPrice.currencyCode}
            </span>
          </span>
          <span className="text-lg text-neutral-500 dark:text-neutral-400">-</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white">
            {new Intl.NumberFormat(undefined, {
              style: 'currency',
              currency: maxPrice.currencyCode,
              currencyDisplay: 'narrowSymbol'
            }).format(parseFloat(maxPrice.amount))}
            <span className={clsx('ml-1 inline', currencyCodeClassName)}>
              {maxPrice.currencyCode}
            </span>
          </span>
        </div>
      );
    } else {
      // Single price from max price when range is requested but min/max are the same
      return (
        <p suppressHydrationWarning={true} className={clsx("text-3xl font-bold text-neutral-900 dark:text-white", className)} {...rest}>
          {new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: maxPrice.currencyCode,
            currencyDisplay: 'narrowSymbol'
          }).format(parseFloat(maxPrice.amount))}
          <span className={clsx('ml-1 inline', currencyCodeClassName)}>
            {maxPrice.currencyCode}
          </span>
        </p>
      );
    }
  }

  // Default single price display
  if (!amount) return null;

  return (
    <p suppressHydrationWarning={true} className={className} {...rest}>
      {new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol'
      }).format(parseFloat(amount))}
      <span className={clsx('ml-1 inline', currencyCodeClassName)}>
        {currencyCode}
      </span>
    </p>
  );
};

export default Price;