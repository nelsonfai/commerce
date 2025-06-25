import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  // Extract product details for enhanced display
  const availability = product.availableForSale ? 'In Stock' : 'Out of Stock';
  const hasMultipleVariants = product.variants.length > 1;
  const productTags = product.tags?.filter(tag => !tag.startsWith('_')) || []; // Filter out hidden tags
  
  // Calculate price range display
  const minPrice = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const hasPriceRange = minPrice.amount !== maxPrice.amount;

  return (
    <>
      {/* Header Section */}
      <div className="mb-8 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-4 text-4xl font-bold leading-tight text-neutral-900 dark:text-white lg:text-5xl">
          {product.title}
        </h1>
        
        {/* Price Section */}
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            {hasPriceRange ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  <Price
                    amount={minPrice.amount}
                    currencyCode={minPrice.currencyCode}
                  />
                </span>
                <span className="text-lg text-neutral-500 dark:text-neutral-400">-</span>
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  <Price
                    amount={maxPrice.amount}
                    currencyCode={maxPrice.currencyCode}
                  />
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                <Price
                  amount={maxPrice.amount}
                  currencyCode={maxPrice.currencyCode}
                />
              </span>
            )}
          </div>
          
          {/* Availability Badge */}
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              product.availableForSale 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              <div className={`mr-1.5 h-2 w-2 rounded-full ${
                product.availableForSale ? 'bg-green-400' : 'bg-red-400'
              }`} />
              {availability}
            </div>
          </div>
        </div>

        {/* Product Tags */}
        {productTags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {productTags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  #{tag}
                </span>
              ))}
              {productTags.length > 5 && (
                <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  +{productTags.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Variants */}
      {hasMultipleVariants && (
        <div className="mb-6">
          <VariantSelector options={product.options} variants={product.variants} />
        </div>
      )}

      {/* Product Description */}
      {product.descriptionHtml ? (
        <div className="mb-8">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">
            Description
          </h3>
          <Prose
            className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
            html={product.descriptionHtml}
          />
        </div>
      ) : product.description ? (
        <div className="mb-8">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {product.description}
          </p>
        </div>
      ) : null}



      {/* Add to Cart Section */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-neutral-200 dark:bg-black dark:border-neutral-700 -mx-4 mt-8">
        <AddToCart product={product} />
      </div>
    </>
  );
}