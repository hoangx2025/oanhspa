import Link from "next/link";
import type { UnifiedProduct } from "@/data/unifiedProduct";


export default function ProductCard({ p }: { p: UnifiedProduct }) {
  const firstImg = (p.images || []).find((x) => (x || "").trim().length > 0);

  return (
    <div className="group rounded-xl border bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg overflow-hidden">
      <Link
        href={`/products/${p.handle}`}
        className="relative block bg-gradient-to-br from-zinc-100 to-white"
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
            <span className="rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">HOT</span>
          ) : null}
          {p.isBest ? (
            <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">BEST</span>
          ) : null}
        </div>
      </Link>

      <div className="px-4 pt-3 pb-4">
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
