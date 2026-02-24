import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map(p => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
