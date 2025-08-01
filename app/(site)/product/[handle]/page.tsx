// app/product/[handle]/page.tsx 
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductCard from 'components/product/product-card';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductProvider } from 'components/product/product-context';
import { ProductDescription } from 'components/product/product-description';
import ProductReviews from 'components/product/reviews/product-reviews';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import { Image } from 'lib/shopify/types';
import { Suspense } from 'react';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  // Simple product JSON-LD without reviews (reviews component will handle its own data)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 mt-12">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden bg-gray-200 animate-pulse rounded" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText
                }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded"></div>}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>

        {/* Reviews Section - Let the component handle its own data fetching */}
        <div id="reviews" className="mt-16">
          <ProductReviews
            productHandle={product.handle}
            productTitle={product.title}
            productId={product.id}
          />
        </div>

        {/* Related Products */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts id={product.id} />
        </Suspense>
      </div>
      <Footer />
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8 mt-16">

      <h2 className="text-3xl font-light text-secondary tracking-tight pb-4">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1 relative scrollbar-hide">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="w-[80%] flex-none min-[475px]:w-[60%] sm:w-[50%] md:w-[33%] lg:w-[25%] xl:w-[20%]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="py-8 mt-16">
      <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
      <div className="flex gap-4 overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-[80%] flex-none min-[475px]:w-[60%] sm:w-[50%] md:w-[33%] lg:w-[25%] xl:w-[20%]"
          >
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}