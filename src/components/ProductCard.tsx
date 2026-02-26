import Image from "next/image";
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
          <div className="relative h-32 sm:h-44 bg-white">
            <Image
              src={firstImg}
              alt={p.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-32 sm:h-44" />
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

      <div className="px-3 pt-2 pb-3 sm:px-4 sm:pt-3 sm:pb-4">
        <div className="text-[10px] sm:text-xs uppercase tracking-widest text-rose-600">{p.brand}</div>
        <Link href={`/products/${p.handle}`} className="mt-0.5 sm:mt-1 line-clamp-2 text-sm sm:text-base font-semibold leading-snug hover:text-rose-600">
          {p.title}
        </Link>

        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          <div className="text-[10px] sm:text-xs opacity-70">{p.category}</div>
        </div>
      </div>
    </div>
  );
}
