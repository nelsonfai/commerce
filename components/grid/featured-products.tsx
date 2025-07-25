import { getCollectionProducts } from 'lib/shopify';
import ProductCard from 'components/product/product-card';
import Link from 'next/link';

export async function ThreeItemGrid() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const featuredProducts = await getCollectionProducts({
    collection: 'featured-snacks',
    first:6
  });

  if (featuredProducts.length == 0) return null;


  return (
    <section className="py-8 sm:py-12 lg:py-16  px-8">
      <div className="mx-auto ">
        <h2 className="text-2xl text-center sm:text-3xl lg:text-4xl font-bold leading-tight  mb-2 text-secondary">
          What's in the box ?
        </h2>
        <p className="text-neutral-700  mb-8 sm:mb-10 lg:mb-12 max-w-4xl text-center mx-auto ">You know that feeling when you taste something and your taste buds start to dance? That’s every Nyumly box. A mix of crunchy, spicy, sweet, and everything in between, curated just for you.</p>

        <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-4 scrollbar-hide">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.handle}`} className="flex-shrink-0 w-64 ">
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