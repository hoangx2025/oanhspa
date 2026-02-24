import type { MarketplaceLink } from "@/data/marketplaceLink";

export default function BuyNowAt({
  links,
}: {
  links?: MarketplaceLink[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Mua ngay tại</div>
          <div className="mt-2 text-xs leading-5 text-zinc-600">
            Giá mua qua sàn thường <b>cao hơn 10–20%</b> do phí sàn và vận hành.
            Nếu tiện, bạn nên <b>mua trực tiếp tại cửa hàng</b> để được giá tốt hơn.
          </div>
        </div>
      </div>

      {links && links.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {links.map((l, i) => (
            <a
              key={i}
              href={l.affiliateUrl ?? l.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
            >
              {l.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
