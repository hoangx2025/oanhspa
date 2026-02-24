export type Product = {
  id: string;
  handle: string;
  title: string;
  brand: string;
  category: "Skincare" | "Bổ sung Collagen" | "Chống lão hóa";
  price: number;
  compareAtPrice?: number;
  imageHint?: "purple" | "amber" | "mint" | "rose" | "slate";
  isHot?: boolean;
  isBest?: boolean;
  flashSaleEndsAtISO?: string; // if present => show countdown in Flash Sale block
};

export const PRODUCTS: Product[] = [
  {
    id: "p001",
    handle: "serum-ageless-total-anti-aging",
    title: "Serum Chống Lão Hóa AGELESS Total Anti‑Aging Serum",
    brand: "IMAGE",
    category: "Chống lão hóa",
    price: 1881000,
    compareAtPrice: 2200000,
    imageHint: "purple",
    isBest: true
  },
  {
    id: "p002",
    handle: "kem-chong-nang-ultra-sheer-spray-spf45",
    title: "Kem Chống Nắng Ultra Sheer Spray SPF45+",
    brand: "IMAGE",
    category: "Skincare",
    price: 1285000,
    compareAtPrice: 1500000,
    imageHint: "amber",
    isBest: true,
    flashSaleEndsAtISO: "2026-03-01T18:00:00+07:00"
  },
  {
    id: "p003",
    handle: "body-spa-rejuvenating-body-lotion",
    title: "Kem Dưỡng Body Trẻ Hóa Da BODY SPA Rejuvenating Body Lotion",
    brand: "IMAGE",
    category: "Bổ sung Collagen",
    price: 1190000,
    compareAtPrice: 1400000,
    imageHint: "mint",
    isHot: true,
    flashSaleEndsAtISO: "2026-03-01T18:00:00+07:00"
  },
  {
    id: "p004",
    handle: "ageless-total-repair-creme",
    title: "Kem Dưỡng Da Mặt Chống Lão Hóa AGELESS Total Repair Crème",
    brand: "IMAGE",
    category: "Chống lão hóa",
    price: 2160000,
    compareAtPrice: 2500000,
    imageHint: "slate",
    isBest: true,
    flashSaleEndsAtISO: "2026-03-01T18:00:00+07:00"
  },
  {
    id: "p005",
    handle: "vital-c-ace-serum",
    title: "VITAL C Hydrating Antioxidant ACE Serum",
    brand: "IMAGE",
    category: "Skincare",
    price: 2355000,
    compareAtPrice: 2800000,
    imageHint: "rose",
    isHot: true
  },
  {
    id: "p006",
    handle: "md-restoring-post-treatment-masque",
    title: "Mặt Nạ Phục Hồi Da MD Restoring Post Treatment Masque",
    brand: "IMAGE",
    category: "Skincare",
    price: 1853000,
    compareAtPrice: 2150000,
    imageHint: "mint"
  },
  {
    id: "p007",
    handle: "the-max-stem-cell-creme",
    title: "Kem Dưỡng Da Mặt The MAX Stem Cell Crème",
    brand: "IMAGE",
    category: "Chống lão hóa",
    price: 3220000,
    compareAtPrice: 3705000,
    imageHint: "slate"
  },
  {
    id: "p008",
    handle: "body-spa-exfoliating-body-scrub",
    title: "Tẩy Tế Bào Chết Toàn Thân BODY SPA Exfoliating Body Scrub",
    brand: "IMAGE",
    category: "Skincare",
    price: 855000,
    compareAtPrice: 995000,
    imageHint: "amber",
    isBest: true
  }
];
