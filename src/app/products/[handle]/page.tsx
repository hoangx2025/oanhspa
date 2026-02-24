import Link from "next/link";
import { productByHandle, allProducts } from "@/lib/catalog";
import { discountPercent, formatVND } from "@/lib/money";

export function generateStaticParams() {
  return allProducts().map(p => ({ handle: p.handle }));
}

export default function ProductPage({ params }: { params: { handle: string } }) {
  const p = productByHandle(params.handle);
  if (!p) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border p-6">Không tìm thấy sản phẩm.</div>
      </main>
    );
  }

  const off = discountPercent(p.price, p.compareAtPrice);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-sm opacity-70">
        <Link href="/" className="hover:text-rose-600">Trang chủ</Link> /{" "}
        <Link href="/collections/all" className="hover:text-rose-600">Sản phẩm</Link> /{" "}
        <span className="opacity-90">{p.title}</span>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border bg-gradient-to-br from-zinc-100 to-white p-6 shadow-soft">
          {/* <div className="flex items-start justify-between">
            <div className="text-xs uppercase tracking-widest text-rose-600">{p.brand}</div>
            {off > 0 ? (
              <div className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white">Tiết kiệm {off}%</div>
            ) : null}
          </div> */}
          <div className="mt-6 h-80 rounded-2xl bg-gradient-to-br from-rose-200 to-white" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[0,1,2,3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-white border" />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold leading-tight">{p.title}</h1>
          {/* <div className="mt-3 flex items-baseline gap-3">
            <div className="text-2xl font-semibold text-rose-600">{formatVND(p.price)}</div>
            {p.compareAtPrice ? (
              <div className="text-sm line-through opacity-50">{formatVND(p.compareAtPrice)}</div>
            ) : null}
          </div> */}

          <div className="mt-6 rounded-2xl border bg-white p-5">
            <div className="text-sm font-semibold">Tùy chọn (demo)</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["30ml", "48g", "142g", "500g"].map(v => (
                <button key={v} className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50">{v}</button>
              ))}
            </div>
            <div className="mt-4 text-sm opacity-70">Mua thêm 500.000đ để được miễn phí giao hàng trên toàn quốc (mô phỏng).</div>

            <div className="mt-5 flex gap-3">
              {/* <button className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 text-white">Thêm vào giỏ</button> */}
              {/* <button className="flex-1 rounded-xl border px-4 py-3">Tư vấn</button> */}
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm">
            <div className="rounded-2xl border p-4">
              <div className="font-semibold">Mô tả</div>
              <div className="mt-2 opacity-75">
                Đây là trang chi tiết sản phẩm dạng tĩnh. Bạn có thể thêm 3–4 style layout khác nhau nếu cần (grid/gallery/accordion…).
              </div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="font-semibold">Chính sách</div>
              <div className="mt-2 opacity-75">Đổi trả, vận chuyển, bảo hành (demo).</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
