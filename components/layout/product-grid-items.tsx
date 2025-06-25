import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/shopify/types';
import Link from 'next/link';
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
