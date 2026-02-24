import Link from "next/link";
import FlashSale from "@/components/FlashSale";
import ProductGrid from "@/components/ProductGrid";
import Tabs from "@/components/Tabs";
import BrandShowcase from "@/components/BrandShowcase";
import { brands, hotWeek, productsByCategory } from "@/lib/catalog";

export default async function HomePage() {
  const brandList = await brands();
  const hot = await hotWeek();
  const skincare = await productsByCategory("Skincare");
  const collagen = await productsByCategory("Bổ sung Collagen");
  const antiaging = await productsByCategory("Chống lão hóa");

  return (
    <main>
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
              <p className="mt-1 text-sm opacity-70">Block mô phỏng slider/hot products.</p>
            </div>
            <Link className="text-sm hover:text-rose-600" href="/collections/all">Xem tất cả →</Link>
          </div>
          <ProductGrid products={hot} />
        </section>

        {/* Flash sale */}
        <section className="mt-12">
          <FlashSale />
        </section>

        {/* Best sellers tabs */}
        <section className="mt-12">
          <div>
            <h2 className="text-2xl font-semibold">Bán chạy trong tháng</h2>
            <p className="mt-1 text-sm opacity-70">
              Có tab theo nhóm: Skincare / Bổ sung Collagen / Chống lão hóa (mô phỏng theo site demo).
            </p>
          </div>

          <div className="mt-5">
            <Tabs
              items={[
                { key: "skincare", label: "Skincare", content: <ProductGrid products={skincare} /> },
                { key: "collagen", label: "Bổ sung Collagen", content: <ProductGrid products={collagen} /> },
                { key: "antiaging", label: "Chống lão hóa", content: <ProductGrid products={antiaging} /> }
              ]}
            />
          </div>
        </section>

        {/* Banner strip */}
        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { title: "Ưu đãi thành viên", desc: "Đăng ký nhận tin để nhận mã giảm giá" },
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
