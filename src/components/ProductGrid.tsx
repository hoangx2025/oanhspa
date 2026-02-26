import type { UnifiedProduct } from "@/data/unifiedProduct";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({
  products,
  gridClassName,
}: {
  products: UnifiedProduct[];
  gridClassName?: string;
}) {
  return (
    <div className={gridClassName ?? "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"}>
      {products.map((p) => (
        <ProductCard key={p.handle} p={p} />
      ))}
    </div>
  );
}
