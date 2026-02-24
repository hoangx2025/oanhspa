import Link from "next/link";
import type { UnifiedProduct } from "@/data/unifiedProduct";
 

export default function ProductCard({ p }: { p: UnifiedProduct }) {
  const firstImg = (p.images || []).find((x) => (x || "").trim().length > 0);

  return (
    <div className="group rounded-3xl border bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        href={`/products/${p.handle}`}
        className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-white"
        aria-label={p.title}
      >
        {firstImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstImg}
            alt={p.title}
            className="h-44 w-full object-cover bg-white"
            loading="lazy"
          />
        ) : (
          <div className="h-44" />
        )}

        <div className="absolute left-3 top-3 flex items-center gap-2">
          {p.isHot ? (
            <span className="rounded-full bg-zinc-900 px-2 py-1 text-[11px] font-semibold text-white">HOT</span>
          ) : null}
          {p.isBest ? (
            <span className="rounded-full bg-rose-500 px-2 py-1 text-[11px] font-semibold text-white">BEST</span>
          ) : null}
        </div>

        {/* Bỏ hiển thị giảm giá/giá ở danh sách (giá nằm ở biến thể trong trang chi tiết) */}
      </Link>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-widest text-rose-600">{p.brand}</div>
        <Link href={`/products/${p.handle}`} className="mt-1 line-clamp-2 font-semibold leading-snug hover:text-rose-600">
          {p.title}
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs opacity-70">{p.category}</div>
        </div>
      </div>
    </div>
  );
}
