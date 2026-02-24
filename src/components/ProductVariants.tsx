"use client";

import { useMemo, useState } from "react";
import type { ProductVariant } from "@/data/unifiedProduct";

export default function ProductVariants({
  variants,
}: {
  variants: ProductVariant[];
}) {
  const safe = useMemo(
    () => variants.filter(v => (v.label || "").trim().length > 0),
    [variants]
  );

  const [selectedId, setSelectedId] = useState(safe[0]?.id);

  const selected = safe.find(v => v.id === selectedId);

  return (
    <div className="mt-6 rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Tùy chọn</div>
        {selected?.label ? (
          <div className="text-xs opacity-70">Đang chọn: {selected.label}</div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {safe.map((v) => {
          const disabled = v.stockStatus === "out_of_stock";
          const active = v.id === selectedId;

          return (
            <button
              key={v.id}
              type="button"
              disabled={disabled}
              onClick={() => setSelectedId(v.id)}
              className={[
                "rounded-xl border px-2 py-1 transition",
                disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-zinc-50",
                active ? "bg-zinc-900 text-white border-zinc-900" : "bg-white",
              ].join(" ")}
              title={disabled ? "Hết hàng" : v.label}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* <div className="mt-4 text-sm opacity-70">
        Mua thêm 500.000đ để được miễn phí giao hàng trên toàn quốc (mô phỏng).
      </div> */}
    </div>
  );
}