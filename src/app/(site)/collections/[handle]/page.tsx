import type { Metadata } from "next";
import { Suspense } from "react";
import { categories, productsByFilters, brands } from "@/lib/catalog";
import PaginatedProductGrid from "@/components/PaginatedProductGrid";
import CategoryFilter from "@/components/CategoryFilter";
import { BreadcrumbJsonLd, CollectionJsonLd } from "@/components/JsonLd";
import { seoConfig, productUrl, collectionUrl } from "@/lib/seo";

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
    case "all": return "Tất cả";
    case "my-pham": return "Mỹ phẩm";
    case "san-pham-ban-chay": return "Bán chạy";
    case "flash-sale": return "Flash Sale";
    default: return "Bộ sưu tập";
  }
}

function descriptionFromHandle(handle: string) {
  switch (handle) {
    case "all": return "Tất cả mỹ phẩm xách tay Hàn Quốc chính hãng tại OANH SPA. Skincare, serum, kem chống nắng, collagen và nhiều hơn nữa.";
    case "san-pham-ban-chay": return "Sản phẩm bán chạy nhất tại OANH SPA - Được khách hàng tin tưởng và lựa chọn nhiều nhất.";
    case "flash-sale": return "Flash Sale - Ưu đãi cực sốc tại OANH SPA. Mua ngay kẻo hết!";
    default: return `Bộ sưu tập mỹ phẩm tại OANH SPA.`;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const title = titleFromHandle(params.handle);
  const description = descriptionFromHandle(params.handle);

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${seoConfig.siteName}`,
      description,
      url: collectionUrl(params.handle),
    },
    alternates: { canonical: `/collections/${params.handle}` },
  };
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
      <BreadcrumbJsonLd
        items={
          params.handle === "all" && !categorySlug && !brandSlug
            ? [
                { name: "Trang chủ", url: seoConfig.siteUrl },
                { name: "Tất cả sản phẩm" },
              ]
            : [
                { name: "Trang chủ", url: seoConfig.siteUrl },
                { name: "Sản phẩm", url: `${seoConfig.siteUrl}/collections/all` },
                { name: title },
              ]
        }
      />
      <CollectionJsonLd
        name={title}
        description={descriptionFromHandle(params.handle)}
        url={collectionUrl(params.handle)}
        items={products.slice(0, 30).map((p) => ({
          name: p.title,
          url: productUrl(p.handle),
        }))}
      />

      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-zinc-400">
          <li><a href="/" className="hover:text-rose-600 transition-colors">Trang chủ</a></li>
          <li><span>/</span></li>
          {params.handle === "all" && !categorySlug && !brandSlug ? (
            <li><span className="text-zinc-700 font-medium">Tất cả sản phẩm</span></li>
          ) : (
            <>
              <li><a href="/collections/all" className="hover:text-rose-600 transition-colors">Sản phẩm</a></li>
              <li><span>/</span></li>
              <li><span className="text-zinc-700 font-medium">{title}</span></li>
            </>
          )}
        </ol>
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
