"use client";

import { useMemo, useState } from "react";
import type { ProductVariant } from "@/data/unifiedProduct";
import { formatVND } from "@/lib/money";

export default function ProductVariants({ variants }: { variants: ProductVariant[] }) {
  const groups = useMemo(() => {
    const m = new Map<string, ProductVariant[]>();
    for (const v of variants) {
      const key = v.name || "Tùy chọn";
      m.set(key, [...(m.get(key) || []), v]);
    }
    return Array.from(m.entries()).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => String(a.value).localeCompare(String(b.value))),
    }));
  }, [variants]);

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const g of groups) init[g.name] = g.items[0]?.value ?? "";
    return init;
  });

  const pickedText = useMemo(() => {
    const parts = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([, v]) => v);
    return parts.join(" · ");
  }, [selected]);

  const pickedVariant = useMemo(() => {
    // Current data model is "one dimension" per row (name/value).
    // If there's only 1 group, we can map selected -> exact variant.
    if (groups.length === 1) {
      const g = groups[0];
      return variants.find((v) => v.name === g.name && v.value === selected[g.name]);
    }

    // Multiple groups: cannot reliably map to a unique SKU with current schema.
    // Return a best-effort (first matching in the first group).
    const g0 = groups[0];
    if (!g0) return undefined;
    return variants.find((v) => v.name === g0.name && v.value === selected[g0.name]);
  }, [groups, selected, variants]);

  return (
    <div className="mt-6 rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">Tùy chọn</div>
        {/* <div className="text-xs opacity-70">Đang chọn: {pickedText || "-"}</div> */}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="rounded-xl bg-zinc-50 px-3 py-2 text-sm">
          <span className="opacity-70">Giá từ: </span>
          <span className="font-semibold">{formatVND(pickedVariant?.price ?? 0)}</span>
          {/* {pickedVariant?.compareAtPrice ? (
            <span className="ml-2 text-xs line-through opacity-50">{formatVND(pickedVariant.compareAtPrice)}</span>
          ) : null} */}
        </div>
        {/* <div className="text-sm opacity-70">Tồn kho: {pickedVariant?.stock ?? 0}</div> */}
      </div>

      <div className="mt-4 grid gap-4">
        {groups.map((g) => (
          <div key={g.name}>
            <div className="text-xs font-semibold opacity-70">{g.name}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {g.items.map((v) => {
                const active = selected[g.name] === v.value;
                return (
                  <button
                    key={`${g.name}-${v.value}`}
                    type="button"
                    onClick={() => setSelected((s) => ({ ...s, [g.name]: v.value }))}
                    className={`rounded-xl border px-4 py-2 text-sm transition ${
                      active ? "bg-zinc-900 text-white border-zinc-900" : "hover:bg-zinc-50"
                    }`}
                  >
                    {v.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* <div className="mt-4 text-sm opacity-70">Mua thêm 500.000đ để được miễn phí giao hàng trên toàn quốc (mô phỏng).</div> */}
    </div>
  );
}
