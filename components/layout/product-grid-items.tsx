import { Product } from 'lib/shopify/types';
import ProductCard from 'components/product/product-card';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <ProductCard product={product}  key={product.id}  />
      ))}
    </>
  );
}
