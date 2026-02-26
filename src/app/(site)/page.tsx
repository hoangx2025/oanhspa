import type { Metadata } from "next";
import Link from "next/link";
import FlashSale from "@/components/FlashSale";
import ProductGrid from "@/components/ProductGrid";
import Tabs from "@/components/Tabs";
import BrandShowcase from "@/components/BrandShowcase";
import { WebSiteJsonLd } from "@/components/JsonLd";
import { brands, hotWeek, productsByCategory, salesByCategory } from "@/lib/catalog";
import { seoConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mỹ phẩm xách tay Hàn Quốc chính hãng",
  description:
    "OANH SPA - Chuyên mỹ phẩm xách tay Hàn Quốc chính hãng: skincare, serum, kem chống nắng, collagen, mặt nạ. Giao hàng toàn quốc, tư vấn miễn phí 24/7.",
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    url: seoConfig.siteUrl,
    images: [{ url: seoConfig.defaultOgImage, width: 1200, height: 630 }],
  },
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [brandList, hot, salesRanking] = await Promise.all([
    brands(),
    hotWeek(),
    salesByCategory(),   // tổng hợp theo tháng hiện tại
  ]);

  // Lấy sản phẩm cho từng category (song song)
  const categoryData = await Promise.all(
    salesRanking.map(({ categoryName }) => productsByCategory(categoryName))
  );

  // Build tab items — đã sort theo doanh số
  const tabItems = salesRanking.map(({ categoryName, totalSold }, idx) => ({
    key: categoryName.toLowerCase().replace(/\s+/g, "-"),
    label: categoryName,
    count: totalSold > 0 ? totalSold : undefined,
    content: <ProductGrid products={categoryData[idx]} />,
  }));

  return (
    <main>
      <WebSiteJsonLd />

      {/* Hero */}
      <section className="bg-gradient-to-b from-rose-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-rose-600">Làm đẹp tự nhiên</div>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">
              Mỹ phẩm xách tay Hàn Quốc
            </h1>
            <p className="mt-4 text-sm md:text-base opacity-75">
              Bố cục trang chủ mô phỏng theme OANH SPA Beauty Cosmetic: hero, thương hiệu, hot tuần qua, flash sale, tab bán chạy trong tháng.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/collections/all" className="rounded-xl bg-zinc-900 px-5 py-3 text-white text-sm">Mua ngay</Link>
              <Link href="/collections/san-pham-ban-chay" className="rounded-xl border px-5 py-3 text-sm">Xem bán chạy</Link>
            </div>
          </div>

          <BrandShowcase brands={brandList} />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* Hot week */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-rose-600">Hot</div>
              <h2 className="mt-2 text-2xl font-semibold">Hot trong tuần qua</h2>
            </div>
            <Link className="text-sm hover:text-rose-600" href="/collections/all">Xem tất cả →</Link>
          </div>
          <ProductGrid products={hot} />
        </section>

        {/* Flash sale */}
        <section className="mt-12">
          <FlashSale />
        </section>

        {/* Best sellers tabs — sorted by monthly sales */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Bán chạy trong tháng</h2>
              <p className="mt-1 text-sm opacity-70">
                Danh mục xếp theo số lượng đã bán trong tháng này.
              </p>
            </div>
            {salesRanking[0]?.totalSold > 0 && (
              <div className="text-xs text-zinc-400 hidden sm:block">
                Cập nhật theo đơn hàng thực tế
              </div>
            )}
          </div>

          <div className="mt-5">
            {tabItems.length > 0 ? (
              <Tabs items={tabItems} />
            ) : (
              <p className="text-sm text-zinc-400">Chưa có dữ liệu danh mục.</p>
            )}
          </div>
        </section>

        {/* Banner strip */}
        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { title: "Giao hàng nhanh", desc: "Miễn phí từ 500.000đ" },
            { title: "Tư vấn 24/7", desc: "Hỗ trợ chọn sản phẩm phù hợp" }
          ].map(b => (
            <div key={b.title} className="rounded-3xl border bg-white p-6 shadow-soft">
              <div className="text-sm font-semibold">{b.title}</div>
              <div className="mt-2 text-sm opacity-70">{b.desc}</div>
              <div className="mt-4 h-24 rounded-2xl bg-gradient-to-br from-zinc-100 to-white" />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
