import { MARKETPLACE_META } from "./marketplaces";
import { MarketplaceLink } from "../data/marketplaceLink";
export default function MarketplaceLinks({
  links,
}: {
  links: MarketplaceLink[];
}) {
  if (!links?.length) return null;

  return (
    <div className="border-t bg-white p-4">
      <h2 className="text-sm font-semibold">Mua ngay tại</h2>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        {links.map((item) => {
          const meta = MARKETPLACE_META[item.platform];
          if (!meta) return null;

          const url = item.affiliateUrl || item.productUrl || process.env.NEXT_PUBLIC_SHOPEE_HOME_PAGE;

          return (
            <a
              key={item.platform}
              href={url}
              target="_blank"
              rel="nofollow sponsored noopener"
              title={`Mua trên ${meta.name}`}
              className="flex h-9 items-center justify-center rounded-xl border bg-white px-3 hover:bg-zinc-50"
            >
              <img
                src={meta.icon}
                alt={meta.name}
                height={35}
                className="h-7 w-auto object-contain"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
