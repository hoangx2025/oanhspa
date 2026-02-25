import Link from "next/link";
import { flashSaleProducts } from "@/lib/catalog";
import ProductGrid from "@/components/ProductGrid";
// import Countdown from "@/components/Countdown";

import dynamic from "next/dynamic";

const Countdown = dynamic(() => import("@/components/Countdown"), { ssr: false });

export default async function FlashSale() {
  const products = await flashSaleProducts();
  const endsAtISO = products[0]?.flashSaleEndsAtISO;

  return (
    <section className="rounded-3xl border bg-gradient-to-br from-rose-50 to-white p-6 md:p-8 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-rose-600">Flash Sale</div>
          <h2 className="mt-2 text-2xl font-semibold">Ưu đãi giới hạn</h2>
          <p className="mt-1 text-sm opacity-70">Nhận biết Flash Sale và đếm ngược thời gian kết thúc (mô phỏng).</p>
        </div>

        {endsAtISO ? (
          <div className="md:text-right">
            <div className="text-xs opacity-60 mb-2">Kết thúc sau</div>
            <Countdown endsAtISO={endsAtISO} />
          </div>
        ) : null}
      </div>

      <ProductGrid products={products.slice(0, 4)} />

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm opacity-70">* Dữ liệu đang lấy từ database (Turso cloud)</div>
        <Link href="/collections/flash-sale" className="rounded-xl bg-zinc-900 px-4 py-3 text-sm text-white">
          Xem toàn bộ sản phẩm Flash Sale
        </Link>
      </div>
    </section>
  );
}
