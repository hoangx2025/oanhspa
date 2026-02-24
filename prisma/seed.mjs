import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const CATEGORIES = [
  { name: "Skincare", slug: "skincare" },
  { name: "Bổ sung Collagen", slug: "bo-sung-collagen" },
  { name: "Chống lão hóa", slug: "chong-lao-hoa" },
];

// Demo products (bạn có thể thay bằng dữ liệu từ DB sau này)
const PRODUCTS = [
  {
    handle: "serum-ageless-total-anti-aging",
    title: "Serum Chống Lão Hóa AGELESS Total Anti‑Aging Serum",
    brand: "IMAGE",
    category: "Chống lão hóa",
    price: 1881000,
    compareAtPrice: 2200000,
    imageHint: "purple",
    isBest: true,
    short: "Serum chống lão hóa, hỗ trợ làm mờ nếp nhăn và tăng độ đàn hồi.",
    description:
      "Serum hỗ trợ chống lão hóa với cảm giác nhẹ, thấm nhanh. Dùng sau toner, trước kem dưỡng.\n\n• Công dụng: hỗ trợ cải thiện nếp nhăn, làm da căng mịn.\n• Hướng dẫn: dùng 2–3 giọt, sáng & tối.\n",
       images: [
      "https://ower.s3.ap-southeast-1.amazonaws.com/linhkiendiy/boost-buck-xl6009-lm2577-1.jpg?AWSAccessKeyId=AKIAWYTKPUQQQYECZMZG&Expires=2084714619&Signature=6UBOE%2BelpDLjxIwyD3wLXHgojNU%3D",
      "https://ower.s3.ap-southeast-1.amazonaws.com/linhkiendiy/boost-buck-xl6009-lm2577-2.jpg?AWSAccessKeyId=AKIAWYTKPUQQQYECZMZG&Expires=2084714698&Signature=DDFYp8i9Cl4HzONy0ehBlerJdWg%3D",
      "https://ower.s3.ap-southeast-1.amazonaws.com/linhkiendiy/boost-buck-xl6009-lm2577-3.jpg?AWSAccessKeyId=AKIAWYTKPUQQQYECZMZG&Expires=2084714728&Signature=ZnKcD8t2aBLrWtav%2FWAsNyN39CA%3D",
    ],
    youtubeUrl: "https://youtu.be/LaBiz1TeT58?si=Emu125TNMQyPHGHJ",
    variants: [
      { name: "Dung tích", value: "30ml" },
      { name: "Dung tích", value: "50ml" },
      { name: "Dung tích", value: "100ml" },
    ],
    marketplaces: [
      { platform: "shopee", productUrl: "https://vn.shp.ee/nTqMjLV" },
    ],
  },
  {
    handle: "kem-chong-nang-ultra-sheer-spray-spf45",
    title: "Kem Chống Nắng Ultra Sheer Spray SPF45+",
    brand: "IMAGE",
    category: "Skincare",
    price: 1285000,
    compareAtPrice: 1500000,
    imageHint: "amber",
    isBest: true,
    flashSaleEndsAt: "2026-03-01T11:00:00.000Z",
    short: "Xịt chống nắng tiện lợi, che phủ mỏng nhẹ.",
    description:
      "Dạng xịt mỏng nhẹ, phù hợp dùng lại trong ngày.\n\n• Công dụng: hỗ trợ bảo vệ da trước tia UV.\n• Hướng dẫn: lắc đều, xịt cách 15–20cm, thoa lại mỗi 2–3 giờ.\n",
    images: [""],
    variants: [{ name: "Dung tích", value: "142g" }],
  },
  {
    handle: "body-spa-rejuvenating-body-lotion",
    title: "Kem Dưỡng Body Trẻ Hóa Da BODY SPA Rejuvenating Body Lotion",
    brand: "BODY SPA",
    category: "Bổ sung Collagen",
    price: 1190000,
    compareAtPrice: 1400000,
    imageHint: "mint",
    isHot: true,
    flashSaleEndsAt: "2026-03-01T11:00:00.000Z",
    short: "Dưỡng ẩm toàn thân, giúp da mềm mịn.",
    description:
      "Lotion body giúp dưỡng ẩm, hỗ trợ da mềm mượt.\n\n• Công dụng: cấp ẩm, làm mịn da.\n• Hướng dẫn: thoa sau tắm, massage đến khi thấm.\n",
    images: [""],
    variants: [{ name: "Dung tích", value: "500g" }],
  },
  {
    handle: "ageless-total-repair-creme",
    title: "Kem Dưỡng Da Mặt Chống Lão Hóa AGELESS Total Repair Crème",
    brand: "IMAGE",
    category: "Chống lão hóa",
    price: 2160000,
    compareAtPrice: 2500000,
    imageHint: "slate",
    isBest: true,
    flashSaleEndsAt: "2026-03-01T11:00:00.000Z",
    short: "Kem dưỡng phục hồi, hỗ trợ làm mịn da.",
    description:
      "Kem dưỡng phù hợp routine tối, khóa ẩm và hỗ trợ phục hồi.\n\n• Công dụng: hỗ trợ phục hồi, làm da mịn.\n• Hướng dẫn: thoa lớp mỏng sau serum, dùng tối.\n",
    images: [""],
    variants: [{ name: "Dung tích", value: "48g" }],
  },
  {
    handle: "vital-c-ace-serum",
    title: "VITAL C Hydrating Antioxidant ACE Serum",
    brand: "VITAL C",
    category: "Skincare",
    price: 2355000,
    compareAtPrice: 2800000,
    imageHint: "rose",
    isHot: true,
    short: "Serum chống oxy hóa, hỗ trợ sáng da.",
    description:
      "Serum vitamin C hỗ trợ chống oxy hóa và đều màu.\n\n• Công dụng: hỗ trợ sáng da, chống oxy hóa.\n• Hướng dẫn: dùng buổi sáng, kết hợp kem chống nắng.\n",
    images: [""],
    variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "md-restoring-post-treatment-masque",
    title: "Mặt Nạ Phục Hồi Da MD Restoring Post Treatment Masque",
    brand: "MD",
    category: "Skincare",
    price: 1853000,
    compareAtPrice: 2150000,
    imageHint: "mint",
    short: "Mặt nạ làm dịu, phù hợp sau treatment.",
    description:
      "Mặt nạ giúp làm dịu và cấp ẩm sau treatment.\n\n• Hướng dẫn: đắp 10–15 phút, 2–3 lần/tuần.\n",
    images: [""],
    variants: [{ name: "Khối lượng", value: "57g" }],
  },
  {
    handle: "the-max-stem-cell-creme",
    title: "Kem Dưỡng Da Mặt The MAX Stem Cell Crème",
    brand: "The MAX",
    category: "Chống lão hóa",
    price: 3220000,
    compareAtPrice: 3705000,
    imageHint: "slate",
    short: "Kem dưỡng cao cấp, hỗ trợ chống lão hóa.",
    description:
      "Kem dưỡng hỗ trợ chống lão hóa, dùng buổi tối.\n",
    images: [""],
    variants: [{ name: "Khối lượng", value: "48g" }],
  },
  {
    handle: "body-spa-exfoliating-body-scrub",
    title: "Tẩy Tế Bào Chết Toàn Thân BODY SPA Exfoliating Body Scrub",
    brand: "BODY SPA",
    category: "Skincare",
    price: 855000,
    compareAtPrice: 995000,
    imageHint: "amber",
    isBest: true,
    short: "Tẩy tế bào chết body, giúp da mịn.",
    description:
      "Tẩy tế bào chết toàn thân, dùng 1–2 lần/tuần.\n",
    images: [""],
    variants: [{ name: "Khối lượng", value: "170g" }],
  },
];

async function main() {
  // Reset demo
  await prisma.marketplaceLink.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  for (const c of CATEGORIES) {
    await prisma.category.create({ data: c });
  }

  const brands = Array.from(new Set(PRODUCTS.map((p) => p.brand)));
  for (const b of brands) {
    await prisma.brand.create({
      data: {
        name: b,
        slug: slugify(b),
        tagline: "Premium Beauty",
        heroNote: `Khám phá các sản phẩm nổi bật từ ${b}.`,
      },
    });
  }

  for (const p of PRODUCTS) {
    const brand = await prisma.brand.findUnique({ where: { name: p.brand } });
    const category = await prisma.category.findUnique({ where: { name: p.category } });
    if (!brand || !category) continue;

    const created = await prisma.product.create({
      data: {
        handle: p.handle,
        title: p.title,
        short: p.short,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        imageHint: p.imageHint ?? null,
        isHot: !!p.isHot,
        isBest: !!p.isBest,
        flashSaleEndsAt: p.flashSaleEndsAt ? new Date(p.flashSaleEndsAt) : null,
        imagesJson: JSON.stringify(p.images ?? []),
        youtubeUrl: p.youtubeUrl ?? null,
        brandId: brand.id,
        categoryId: category.id,
      },
    });

    const variants = p.variants ?? [];
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      await prisma.variant.create({
        data: {
          productId: created.id,
          name: v.name,
          value: v.value,
          price: v.price ?? null,
          compareAt: v.compareAt ?? null,
          sku: v.sku ?? null,
          sortOrder: i,
        },
      });
    }

    const links = p.marketplaces ?? [];
    for (let i = 0; i < links.length; i++) {
      const m = links[i];
      await prisma.marketplaceLink.create({
        data: {
          productId: created.id,
          platform: m.platform,
          productUrl: m.productUrl,
          sortOrder: i,
        },
      });
    }
  }

  console.log("✅ Seed done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
