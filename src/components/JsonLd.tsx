// src/components/JsonLd.tsx — JSON-LD structured data components

import { seoConfig } from "@/lib/seo";

type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization — dùng trong root/site layout */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        logo: `${seoConfig.siteUrl}/logo.png`,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: process.env.NEXT_PUBLIC_HOTLINE || "",
          contactType: "customer service",
          availableLanguage: "Vietnamese",
        },
        sameAs: [
          process.env.NEXT_PUBLIC_ZALO_LINK,
          process.env.NEXT_PUBLIC_MESSENGER_LINK,
          process.env.NEXT_PUBLIC_SHOPEE_SHOP_URL,
        ].filter(Boolean),
      }}
    />
  );
}

/** WebSite + SearchAction — dùng trong homepage */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${seoConfig.siteUrl}/collections/all?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

/** Product — dùng trong trang chi tiết sản phẩm */
export function ProductJsonLd({
  name,
  description,
  images,
  brand,
  url,
  variants,
}: {
  name: string;
  description?: string;
  images: string[];
  brand: string;
  url: string;
  variants: { price: number; compareAtPrice?: number }[];
}) {
  const prices = variants.map((v) => v.price).filter((p) => p > 0);
  const lowPrice = prices.length ? Math.min(...prices) : 0;
  const highPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description: description || undefined,
        image: images.length > 0 ? images : undefined,
        brand: { "@type": "Brand", name: brand },
        url,
        offers:
          prices.length > 1
            ? {
                "@type": "AggregateOffer",
                priceCurrency: "VND",
                lowPrice,
                highPrice,
                offerCount: prices.length,
                availability: "https://schema.org/InStock",
              }
            : {
                "@type": "Offer",
                priceCurrency: "VND",
                price: lowPrice,
                availability: "https://schema.org/InStock",
              },
      }}
    />
  );
}

/** BreadcrumbList — dùng cho product & collection pages */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url?: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          ...(item.url ? { item: item.url } : {}),
        })),
      }}
    />
  );
}

/** CollectionPage / ItemList — dùng cho collection pages */
export function CollectionJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description?: string;
  url: string;
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            url: item.url,
          })),
        },
      }}
    />
  );
}
