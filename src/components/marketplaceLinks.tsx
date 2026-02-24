import { MARKETPLACE_META } from "./marketplaces";
import { MarketplaceLink } from "../data/marketplaceLink";
export default function MarketplaceLinks({
  links,
}: {
  links: MarketplaceLink[];
}) {
  if (!links?.length) return null;

  return (
    <div  className="card" 
      style={{
        marginTop: 16,
        padding: 14,
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "#fff",
      }}
    >
      <h2 style={{ margin: "0 0 8px", fontSize: 16 }}>Mua ngay tại</h2>

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
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
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 35,
              }}
            >
              <img
                src={meta.icon}
                alt={meta.name}
                height={35}
                style={{
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
