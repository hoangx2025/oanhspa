import { MarketplaceCode } from "./marketplaceCode";

export const MARKETPLACE_META: Record<
  MarketplaceCode,
  {
    name: string;
    color: string;
    icon: any;
  }
> = {
  shopee: {
    name: "Shopee",
    color: "#ee4d2d",
    icon:  process.env.NEXT_PUBLIC_SHOPEE_ICON,
  },
  lazada: {
    name: "Lazada",
    color: "#1a1aff",
    icon: process.env.NEXT_PUBLIC_LÂZDA_ICON,
  },
  tiktok: {
    name: "TikTok Shop",
    color: "#000",
    icon: process.env.NEXT_PUBLIC_TIKTOK_ICON,
  },
};
