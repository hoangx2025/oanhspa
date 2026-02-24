import { PRODUCTS, type Product } from "@/data/products";

export function allProducts() {
  return PRODUCTS;
}

export function productByHandle(handle: string) {
  return PRODUCTS.find(p => p.handle === handle);
}

export function productsByCategory(cat: Product["category"]) {
  return PRODUCTS.filter(p => p.category === cat);
}

export function flashSaleProducts() {
  return PRODUCTS.filter(p => !!p.flashSaleEndsAtISO);
}

export function bestSellers() {
  return PRODUCTS.filter(p => p.isBest).slice(0, 8);
}

export function hotWeek() {
  return PRODUCTS.filter(p => p.isHot).slice(0, 8);
}
