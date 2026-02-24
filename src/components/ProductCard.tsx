"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { discountPercent, formatVND } from "@/lib/money";

function colorFromHint(h?: Product["imageHint"]) {
  switch (h) {
    case "purple": return "from-purple-200 to-purple-50";
    case "amber": return "from-amber-200 to-amber-50";
    case "mint": return "from-emerald-200 to-emerald-50";
    case "rose": return "from-rose-200 to-rose-50";
    default: return "from-slate-200 to-slate-50";
  }
}

export default function ProductCard({ p }: { p: Product }) {
  const [quick, setQuick] = useState(false);
  const off = discountPercent(p.price, p.compareAtPrice);

  return (
    <div className="group rounded-2xl border bg-white overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className={"relative aspect-[1/1] bg-gradient-to-br " + colorFromHint(p.imageHint)}>
        {/* {off > 0 && (
          <div className="absolute left-3 top-3 rounded-lg bg-rose-500 px-2 py-1 text-xs font-semibold text-white">
            {off}%
          </div>
        )} */}

        <button
          onClick={() => setQuick(true)}
          className="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-2 text-xs shadow-soft opacity-0 group-hover:opacity-100 transition"
        >
          Xem nhanh
        </button>

        <Link
          href={`/products/${p.handle}`}
          className="absolute bottom-3 right-3 rounded-xl bg-zinc-900 px-3 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition"
        >
          Chi tiết
        </Link>
      </div>

      <div className="p-4">
        <div className="text-xs opacity-60">{p.brand}</div>
        <Link href={`/products/${p.handle}`} className="mt-1 block text-sm font-medium leading-snug line-clamp-2 hover:text-rose-600">
          {p.title}
        </Link>
        {/* <div className="mt-2 flex items-baseline gap-2">
          <div className="font-semibold text-rose-600">{formatVND(p.price)}</div>
          {p.compareAtPrice ? (
            <div className="text-xs line-through opacity-50">{formatVND(p.compareAtPrice)}</div>
          ) : null}
        </div> */}

        {/* <button className="mt-3 w-full rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50">
          Xem chi tiết
        </button> */}
      </div>

      {quick && (
        <div className="fixed inset-0 z-[60] bg-black/40 p-4 flex items-center justify-center" onClick={() => setQuick(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs opacity-60">{p.brand}</div>
                <div className="text-lg font-semibold leading-snug">{p.title}</div>
                <div className="mt-2 font-semibold text-rose-600">{formatVND(p.price)}</div>
              </div>
              <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => setQuick(false)}>Đóng</button>
            </div>
            <div className={"mt-4 h-56 rounded-2xl bg-gradient-to-br " + colorFromHint(p.imageHint)} />
            <div className="mt-4 flex gap-3">
              <Link className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 text-center text-white" href={`/products/${p.handle}`}>
                Xem trang sản phẩm
              </Link>
              <button className="flex-1 rounded-xl border px-4 py-3">Xem chi tiết</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
