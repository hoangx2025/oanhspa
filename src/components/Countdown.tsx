"use client";

import { useEffect, useMemo, useState } from "react";

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function Countdown({ endsAtISO }: { endsAtISO: string }) {
  const end = useMemo(() => new Date(endsAtISO).getTime(), [endsAtISO]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, end - now);
  const total = Math.floor(diff / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const box = (label: string, value: string) => (
    <div className="rounded-xl bg-white/80 border px-3 py-2 text-center min-w-[64px]">
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wide opacity-60">{label}</div>
    </div>
  );

  return (
    <div className="flex gap-2">
      {box("Ngày", pad(d))}
      {box("Giờ", pad(h))}
      {box("Phút", pad(m))}
      {box("Giây", pad(s))}
    </div>
  );
}
