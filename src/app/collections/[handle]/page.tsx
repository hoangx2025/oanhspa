import { allProducts, bestSellers, flashSaleProducts, brands, productsByBrandSlug } from "@/lib/catalog";
import PaginatedProductGrid from "@/components/PaginatedProductGrid";

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
    default: return await allProducts();
  }
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams?: { brand?: string; page?: string };
}) {
  const brandSlug = searchParams?.brand;
  const currentPage = Math.max(1, Number(searchParams?.page || "1"));

  let title = titleFromHandle(params.handle);
  let products;

  if (brandSlug) {
    const brandList = await brands();
    const matchedBrand = brandList.find((b) => b.slug === brandSlug);
    if (matchedBrand) title = matchedBrand.name;
    products = await productsByBrandSlug(brandSlug, 100);
  } else {
    products = await productsFromHandle(params.handle);
  }

  // baseUrl không chứa ?page= để PaginatedProductGrid tự append
  const baseUrl = brandSlug
    ? `/collections/${params.handle}?brand=${brandSlug}`
    : `/collections/${params.handle}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-gradient-to-br from-rose-50 to-white p-6 md:p-8 shadow-soft">
        <div className="text-xs uppercase tracking-widest text-rose-600">
          {brandSlug ? "Thương hiệu" : "Collections"}
        </div>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        {!brandSlug && (
          <p className="mt-2 text-sm opacity-70">Trang nhóm sản phẩm. Có thể mở rộng filter/sort sau.</p>
        )}
      </div>

      <PaginatedProductGrid
        products={products}
        currentPage={currentPage}
        baseUrl={baseUrl}
      />
    </main>
  );
}
