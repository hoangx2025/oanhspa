import type { MarketplaceLink } from "./marketplaceLink";

const PLATFORM_LABEL: Record<string, string> = {
  shopee: "Shopee",
  lazada: "Lazada",
  tiktok: "TikTok Shop",
  tiki: "Tiki",
  sendo: "Sendo",
  website: "Website",
};

function labelOf(platform: string) {
  const k = String(platform || "").toLowerCase();
  return PLATFORM_LABEL[k] || platform;
}

export default function MarketplaceButtons({ marketplaces }: { marketplaces: MarketplaceLink[] }) {
  const list = (marketplaces || []).filter((m) => (m?.productUrl || "").trim().length > 0);
  if (list.length === 0) return null;

  return (
    <div className="mt-5 rounded-2xl border bg-white p-5">
      <div className="text-sm font-semibold">Mua ngay</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {list.map((m, i) => (
          <a
            key={`${m.platform}-${i}`}
            href={m.productUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            {labelOf(m.platform)}
          </a>
        ))}
      </div>
      <div className="mt-2 text-xs opacity-60">* Link mở tab mới (mô phỏng)</div>
    </div>
  );
}
