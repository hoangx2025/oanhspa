import { MarketplaceCode } from "./marketplaceCode";

export type MarketplaceLink = {
  platform: MarketplaceCode;

  /** Link sản phẩm gốc */
  productUrl: string;

  /** Link affiliate (ưu tiên nếu có) */
  affiliateUrl?: string;

  /** ID shop / seller (optional) */
  seller?: string;
};
