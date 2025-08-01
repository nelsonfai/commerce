import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';
import { StarRating, CountryOrigin } from './product-info-components';

export function ProductDescription({ product }: { product: Product }) {
  // Extract product details for enhanced display
  const availability = product.availableForSale ? 'In Stock' : 'Out of Stock';
  const hasMultipleVariants = product.variants.length > 1;
  const productTags = product.tags?.filter(tag => !tag.startsWith('_')) || [];

  return (
    <>
      {/* Header Section */}
      <div className="mb-12 pb-8 border-b border-slate-200 dark:border-neutral-700">
        <div className="space-y-6">
          {/* Product Title */}
          <div>
            <h1 className="text-4xl font-light text-secondary tracking-tight leading-tight lg:text-5xl">
              {product.title}
            </h1>
          </div>
          
          {/* Rating and Origin */}
          <div className="space-y-3">
            <StarRating metafields={product.metafields} />
            <CountryOrigin metafields={product.metafields} />
          </div>

          {/* Price Section */}
          <div className="space-y-4">
            <div className="flex items-baseline">
              <Price 
                priceRange={product.priceRange}
                showRange={true}
              />
            </div>

            {/* Availability Badge */}
            <div className="flex items-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                product.availableForSale
                  ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                  : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
              }`}>
                <div className={`mr-2 h-2 w-2 rounded-full ${
                  product.availableForSale ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {availability}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Product Variants */}
      {hasMultipleVariants && (
        <div className="mb-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-secondary">
              Options
            </h3>
            <VariantSelector options={product.options} variants={product.variants} />
          </div>
        </div>
      )}

      {/* Product Description */}
      {(product.descriptionHtml || product.description) && (
        <div className="mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-secondary tracking-tight">
              About this product
            </h2>
            <div className="prose-container">
              {product.descriptionHtml ? (
                <Prose
                  className="text-slate-600 dark:text-neutral-400 leading-relaxed font-light text-base"
                  html={product.descriptionHtml}
                />
              ) : (
                <p className="text-slate-600 dark:text-neutral-400 leading-relaxed font-light text-base">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Section */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm p-6 border-t border-slate-200 dark:bg-black/95 dark:border-neutral-700 -mx-4 mt-8 rounded-t-lg">
        <AddToCart product={product} />
      </div>
    </>
  );
}