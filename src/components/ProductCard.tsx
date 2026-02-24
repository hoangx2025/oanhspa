import Link from "next/link";
import type { Product } from "@/data/products";
import { discountPercent } from "@/lib/money";

function colorFromHint(h?: Product["imageHint"]) {
  switch (h) {
    case "purple": return "from-purple-200 to-purple-50";
    case "amber": return "from-amber-200 to-amber-50";
    case "mint": return "from-emerald-200 to-emerald-50";
    case "rose": return "from-rose-200 to-rose-50";
    default: return "from-slate-200 to-slate-50";
  }
}

function firstImage(p: Product) {
  const img = p.images?.find(x => typeof x === "string" && x.trim().length > 0);
  return img || "";
}

export default function ProductCard({ p }: { p: Product }) {
  const off = discountPercent(p.price, p.compareAtPrice);
  const img = firstImage(p);

  return (
    <div className="group rounded-2xl border bg-white overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <Link
        href={`/products/${p.handle}`}
        className={"relative block aspect-[1/1] " + (img ? "bg-white" : "bg-gradient-to-br " + colorFromHint(p.imageHint))}
        aria-label={p.title}
      >
        {/* {off > 0 && (
          <div className="absolute left-3 top-3 rounded-lg bg-rose-500 px-2 py-1 text-xs font-semibold text-white">
            {off}%
          </div>
        )} */}

        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={p.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </Link>

      <div className="p-4">
        <div className="text-xs opacity-60">{p.brand}</div>
        <Link
          href={`/products/${p.handle}`}
          className="mt-1 block text-sm font-medium leading-snug line-clamp-2 hover:text-rose-600"
        >
          {p.title}
        </Link>
      </div>
    </div>
  );
}
