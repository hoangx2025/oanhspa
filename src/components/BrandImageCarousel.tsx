"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  id: string;
  title: string;
  handle?: string;
  images?: string[];
};

function firstImage(p: Item) {
  const img = (p.images || []).find((x) => (x || "").trim().length > 0);
  return img || "";
}

export default function BrandImageCarousel({
  products,
  height = 260,
  intervalMs = 2500,
}: {
  products: Item[];
  height?: number;
  intervalMs?: number;
}) {
  const imgs = useMemo(() => {
    return (products || [])
      .map((p) => ({ id: p.id, title: p.title, url: firstImage(p) }))
      .filter((x) => x.url.length > 0);
  }, [products]);

  const [idx, setIdx] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (imgs.length <= 1) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIdx((i) => (i + 1) % imgs.length);
    }, intervalMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [idx, imgs.length, intervalMs]);

  // giữ layout không giật dù chưa có dữ liệu/ảnh
  if (imgs.length === 0) {
    return (
      <div
        className="rounded-2xl bg-gradient-to-br from-rose-50 to-white border"
        style={{ height }}
      />
    );
  }

  const cur = imgs[idx];

  return (
    <div className="rounded-2xl border bg-white overflow-hidden" style={{ height }}>
      {/* khung ảnh cố định chiều cao */}
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cur.url}
          alt={cur.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />

        {/* dots nhỏ */}
        {imgs.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {imgs.slice(0, 8).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={[
                  "h-1.5 rounded-full transition",
                  i === idx ? "w-6 bg-zinc-900/80" : "w-2 bg-zinc-400/40",
                ].join(" ")}
                aria-label={`slide-${i}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}