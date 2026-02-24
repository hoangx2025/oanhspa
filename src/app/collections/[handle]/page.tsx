import { allProducts, bestSellers, flashSaleProducts } from "@/lib/catalog";
import ProductGrid from "@/components/ProductGrid";

export function generateStaticParams() {
  return [
    { handle: "all" },
    { handle: "my-pham" },
    { handle: "san-pham-ban-chay" },
    { handle: "flash-sale" },
  ];
}

function titleFromHandle(handle: string) {
  switch (handle) {
    case "all": return "Tất cả sản phẩm";
    case "my-pham": return "Mỹ phẩm";
    case "san-pham-ban-chay": return "Sản phẩm bán chạy";
    case "flash-sale": return "Flash Sale";
    default: return "Bộ sưu tập";
  }
}

async function productsFromHandle(handle: string) {
  switch (handle) {
    case "san-pham-ban-chay": return await bestSellers();
    case "flash-sale": return await flashSaleProducts();
    case "my-pham": return await allProducts();
    case "all": return await allProducts();
    default: return await allProducts();
  }
}

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const title = titleFromHandle(params.handle);
  const products = await productsFromHandle(params.handle);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-gradient-to-br from-rose-50 to-white p-6 md:p-8 shadow-soft">
        <div className="text-xs uppercase tracking-widest text-rose-600">Collections</div>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm opacity-70">Trang nhóm sản phẩm (mô phỏng). Có thể mở rộng filter/sort sau.</p>
      </div>
      <ProductGrid products={products} />
    </main>
  );
}
