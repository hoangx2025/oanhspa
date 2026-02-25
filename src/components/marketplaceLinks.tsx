import { MARKETPLACE_META } from "./marketplaces";
import { MarketplaceLink } from "../data/marketplaceLink";
import VoucherSection from "./VoucherSection";

export default function MarketplaceLinks({ links, productTitle }: { links: MarketplaceLink[]; productTitle?: string }) {
  if (!links?.length) return null;

  const shopeeLink = links.find((l) => l.platform === "shopee");
  const shopeeUrl = shopeeLink?.affiliateUrl || shopeeLink?.productUrl;

  return (
    <div className="flex flex-1 flex-col border-t bg-white px-4 pt-4 pb-4">
      <div className="text-sm font-semibold">Mua ngay tại</div>

      {/* Logo các sàn */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
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
              className="flex h-9 items-center justify-center rounded-xl border bg-white px-3 hover:bg-zinc-50 transition"
            >
              <img src={meta.icon} alt={meta.name} height={35} className="h-7 w-auto object-contain" />
            </a>
          );
        })}
      </div>

      {/* Note: giá sàn đắt hơn */}
      <p className="mt-1.5 text-xs leading-relaxed opacity-70">
        Giá mua qua sàn thường cao hơn{" "}
        <span className="font-semibold text-zinc-900">10–20%</span> do phí nền tảng &amp; vận hành.{" "}
        <span className="font-medium text-rose-600">
          Nên mua trực tiếp tại cửa hàng để được giá tốt nhất.
        </span>
      </p>

      {/* Voucher — đẩy xuống bottom */}
      <div className="mt-auto pt-4">
        <div className="text-sm font-semibold">Quý khách hàng có thể lấy voucher bên dưới để giảm giá ngay tại cửa hàng</div>
        <VoucherSection shopeeUrl={shopeeUrl} productTitle={productTitle} />
      </div>
    </div>
  );
}
