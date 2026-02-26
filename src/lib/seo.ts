// src/lib/seo.ts — SEO config tập trung

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oanhspa.com";

export const seoConfig = {
  siteUrl: SITE_URL,
  siteName: "OANH SPA",
  defaultTitle: "OANH SPA - Mỹ phẩm xách tay Hàn Quốc chính hãng",
  defaultDescription:
    "Chuyên mỹ phẩm xách tay Hàn Quốc chính hãng: skincare, serum, kem chống nắng, collagen. Giao hàng toàn quốc, tư vấn miễn phí 24/7.",
  defaultOgImage: `${SITE_URL}/og-default.png`,
  locale: "vi_VN",
  twitterHandle: undefined as string | undefined,
} as const;

export function productUrl(handle: string) {
  return `${seoConfig.siteUrl}/products/${handle}`;
}

export function collectionUrl(handle: string) {
  return `${seoConfig.siteUrl}/collections/${handle}`;
}
