"use client";

import { useState } from "react";

export type TabItem = {
  key: string;
  label: string;
  count?: number;   // số đơn bán — hiển thị badge nếu có
  content: React.ReactNode;
};

export default function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.key);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map(i => (
          <button
            key={i.key}
            onClick={() => setActive(i.key)}
            className={
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border transition " +
              (active === i.key ? "bg-zinc-900 text-white border-zinc-900" : "bg-white hover:bg-zinc-50")
            }
          >
            {i.label}
            {i.count !== undefined && (
              <span className={
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none " +
                (active === i.key ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500")
              }>
                {i.count.toLocaleString("vi-VN")}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {items.find(i => i.key === active)?.content}
      </div>
    </div>
  );
}
