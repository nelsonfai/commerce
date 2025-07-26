// app/product/[handle]/page.tsx - Updated version with Judge.me integration
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
import { getProductReviews, getProductReviewInfo } from 'lib/judgeme';
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

  // Fetch Judge.me reviews data in parallel
  const [reviewsData, reviewInfo] = await Promise.all([
    getProductReviews(params.handle, 1, 10),
    getProductReviewInfo(params.handle)
  ]);

  const averageRating = reviewInfo?.product?.average_rating || 0;
  const totalReviews = reviewInfo?.product?.reviews_count || 0;

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
    },
    // Add structured data for reviews (helps with SEO)
    ...(totalReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: totalReviews,
        bestRating: 5,
        worstRating: 1
      }
    })
  };

  return (
    <Suspense fallback={<div className="flex justify-center py-20">Loading product...</div>}>
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
                  <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
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

          {/* Reviews Section */}
          <div id="reviews" className="mt-16">
            <Suspense 
              fallback={
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b border-gray-200 pb-6">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <ProductReviews
                productHandle={product.handle}
                productTitle={product.title}
                productId={product.id}
              />
            </Suspense>
          </div>

          {/* Related Products */}
          <RelatedProducts id={product.id} />
        </div>
        <Footer />
      </ProductProvider>
    </Suspense>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8 mt-16">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1 relative">
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