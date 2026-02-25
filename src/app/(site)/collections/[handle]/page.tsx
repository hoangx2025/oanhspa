import { Suspense } from "react";
import { categories, productsByFilters, brands } from "@/lib/catalog";
import PaginatedProductGrid from "@/components/PaginatedProductGrid";
import CategoryFilter from "@/components/CategoryFilter";

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

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams?: { brand?: string; category?: string; page?: string };
}) {
  const brandSlug = searchParams?.brand;
  const categorySlug = searchParams?.category;
  const currentPage = Math.max(1, Number(searchParams?.page || "1"));

  const [categoryList, products] = await Promise.all([
    categories(),
    (async () => {
      // Xác định bộ lọc cơ bản theo handle
      const baseOpts: Parameters<typeof productsByFilters>[0] = { limit: 200 };
      if (params.handle === "san-pham-ban-chay") baseOpts.isBest = true;
      if (params.handle === "flash-sale") baseOpts.hasFlashSale = true;

      // Áp dụng brand / category filter
      if (brandSlug) baseOpts.brandSlug = brandSlug;
      if (categorySlug) baseOpts.categorySlug = categorySlug;

      return productsByFilters(baseOpts);
    })(),
  ]);

  // Tiêu đề: ưu tiên brand > category > handle
  let title = titleFromHandle(params.handle);
  if (brandSlug) {
    const brandList = await brands();
    const matched = brandList.find((b) => b.slug === brandSlug);
    if (matched) title = matched.name;
  } else if (categorySlug) {
    const matched = categoryList.find((c) => c.slug === categorySlug);
    if (matched) title = matched.name;
  }

  // baseUrl giữ tất cả filter hiện tại trừ page
  const baseParams = new URLSearchParams();
  if (brandSlug) baseParams.set("brand", brandSlug);
  if (categorySlug) baseParams.set("category", categorySlug);
  const qs = baseParams.toString();
  const baseUrl = `/collections/${params.handle}${qs ? `?${qs}` : ""}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <nav className="flex items-center gap-1.5 text-sm text-zinc-400">
        <a href="/" className="hover:text-rose-600 transition-colors">Trang chủ</a>
        <span>/</span>
        {params.handle === "all" && !categorySlug && !brandSlug ? (
          <span className="text-zinc-700 font-medium">Tất cả sản phẩm</span>
        ) : (
          <>
            <a href="/collections/all" className="hover:text-rose-600 transition-colors">Sản phẩm</a>
            <span>/</span>
            <span className="text-zinc-700 font-medium">{title}</span>
          </>
        )}
      </nav>

      <Suspense fallback={null}>
        <CategoryFilter categories={categoryList} />
      </Suspense>

      <PaginatedProductGrid
        products={products}
        currentPage={currentPage}
        baseUrl={baseUrl}
      />
    </main>
  );
}
