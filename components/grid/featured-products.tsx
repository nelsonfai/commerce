import { getCollectionProducts } from 'lib/shopify';
import ProductCard from 'components/product/product-card';
import Link from 'next/link';

export async function ThreeItemGrid() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getCollectionProducts({
    collection: 'featured-snacks',
    first:6
  });

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const featuredProducts = homepageItems.slice(0, 6);

  return (
    <section className="py-8 sm:py-12 lg:py-16  px-8">
      <div className="mx-auto ">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-8 sm:mb-10 lg:mb-12 text-secondary">
          Featured Snacks
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.handle}`}>
              <ProductCard
                key={product.id}
                product={product}  
                showQuantityControls={true}
                cardStyle="featured"

              />
              </Link>
          ))}
        </div>
      </div>
    </section>
  );
}