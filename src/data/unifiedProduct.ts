// src/data/unifiedProduct.ts
import { MarketplaceLink } from "./marketplaceLink";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "pre_order";

export type ProductSpecification = {
  key: string;
  value: string;
};

export type Category = "Skincare" | "Bổ sung Collagen" | "Chống lão hóa";

export type ProductVariant = {
  id: string;          // unique trong product
  label: string;       // ví dụ "30ml", "50ml"
  price?: number;      // nếu biến thể có giá riêng
  compareAtPrice?: number;
  stockStatus?: StockStatus
};


export type UnifiedProduct = {
  // Identity
  id: string;
  handle: string; // dùng cho URL /products/[handle]
  title: string;  // tên hiển thị (luxury)

  // Basic
  brand: string;
  category: Category | string;

  // Pricing
  price: number;
  compareAtPrice?: number;
  currency: "VND";

  // Inventory / flags
  stockStatus: StockStatus;
  isHot?: boolean;
  isBest?: boolean;
  flashSaleEndsAtISO?: string;

  // Content (trọng tâm cho làm đẹp)
  short?: string;
  description?: string;
  usage?: string[];
  usage_steps?: string[];
  notes?: string[];

  // Media / SEO
  images?: string[];
  youtubeUrl?: string;

  // Tech / detail (optional)
  model?: string;
  specifications?: ProductSpecification[];
  tags?: string[];

  // Marketplace / voucher
  marketplaces?: MarketplaceLink[];

  imageHint?: "purple" | "amber" | "mint" | "rose" | "slate";
  variants?: ProductVariant[];
};