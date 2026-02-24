import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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

const FLASH_END = "2026-03-01T11:00:00.000Z";

const PRODUCTS = [
  // ─── 8 SẢN PHẨM CŨ ────────────────────────────────────────────────────────
  {
    handle: "serum-ageless-total-anti-aging",
    title: "Serum Chống Lão Hóa AGELESS Total Anti‑Aging Serum",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 1881000, compareAtPrice: 2200000,
    isBest: true,
    short: "Serum chống lão hóa, hỗ trợ làm mờ nếp nhăn và tăng độ đàn hồi.",
    description: "Serum hỗ trợ chống lão hóa với cảm giác nhẹ, thấm nhanh.\n\n• Công dụng: hỗ trợ cải thiện nếp nhăn, làm da căng mịn.\n• Hướng dẫn: dùng 2–3 giọt, sáng & tối.\n",
    images: ["https://ower.s3.ap-southeast-1.amazonaws.com/linhkiendiy/boost-buck-xl6009-lm2577-1.jpg?AWSAccessKeyId=AKIAWYTKPUQQQYECZMZG&Expires=2084714619&Signature=6UBOE%2BelpDLjxIwyD3wLXHgojNU%3D"],
    youtubeUrl: "https://youtu.be/LaBiz1TeT58?si=Emu125TNMQyPHGHJ",
    variants: [{ name: "Dung tích", value: "30ml" }, { name: "Dung tích", value: "50ml" }, { name: "Dung tích", value: "100ml" }],
    marketplaces: [{ platform: "shopee", productUrl: "https://vn.shp.ee/nTqMjLV" }],
  },
  {
    handle: "kem-chong-nang-ultra-sheer-spray-spf45",
    title: "Kem Chống Nắng Ultra Sheer Spray SPF45+",
    brand: "IMAGE", category: "Skincare",
    price: 1285000, compareAtPrice: 1500000,
    isBest: true, flashSaleEndsAt: FLASH_END,
    short: "Xịt chống nắng tiện lợi, che phủ mỏng nhẹ.",
    description: "Dạng xịt mỏng nhẹ, phù hợp dùng lại trong ngày.\n\n• Công dụng: hỗ trợ bảo vệ da trước tia UV.\n• Hướng dẫn: lắc đều, xịt cách 15–20cm, thoa lại mỗi 2–3 giờ.\n",
    images: [],
    variants: [{ name: "Dung tích", value: "142g" }],
  },
  {
    handle: "body-spa-rejuvenating-body-lotion",
    title: "Kem Dưỡng Body Trẻ Hóa Da BODY SPA Rejuvenating Body Lotion",
    brand: "BODY SPA", category: "Bổ sung Collagen",
    price: 1190000, compareAtPrice: 1400000,
    isHot: true, flashSaleEndsAt: FLASH_END,
    short: "Dưỡng ẩm toàn thân, giúp da mềm mịn.",
    description: "Lotion body giúp dưỡng ẩm, hỗ trợ da mềm mượt.\n\n• Công dụng: cấp ẩm, làm mịn da.\n• Hướng dẫn: thoa sau tắm, massage đến khi thấm.\n",
    images: [],
    variants: [{ name: "Dung tích", value: "500g" }],
  },
  {
    handle: "ageless-total-repair-creme",
    title: "Kem Dưỡng Da Mặt Chống Lão Hóa AGELESS Total Repair Crème",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 2160000, compareAtPrice: 2500000,
    isBest: true, flashSaleEndsAt: FLASH_END,
    short: "Kem dưỡng phục hồi, hỗ trợ làm mịn da.",
    description: "Kem dưỡng phù hợp routine tối, khóa ẩm và hỗ trợ phục hồi.\n\n• Công dụng: hỗ trợ phục hồi, làm da mịn.\n• Hướng dẫn: thoa lớp mỏng sau serum, dùng tối.\n",
    images: [],
    variants: [{ name: "Dung tích", value: "48g" }],
  },
  {
    handle: "vital-c-ace-serum",
    title: "VITAL C Hydrating Antioxidant ACE Serum",
    brand: "VITAL C", category: "Skincare",
    price: 2355000, compareAtPrice: 2800000,
    isHot: true,
    short: "Serum chống oxy hóa, hỗ trợ sáng da.",
    description: "Serum vitamin C hỗ trợ chống oxy hóa và đều màu.\n\n• Công dụng: hỗ trợ sáng da, chống oxy hóa.\n• Hướng dẫn: dùng buổi sáng, kết hợp kem chống nắng.\n",
    images: [],
    variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "md-restoring-post-treatment-masque",
    title: "Mặt Nạ Phục Hồi Da MD Restoring Post Treatment Masque",
    brand: "MD", category: "Skincare",
    price: 1853000, compareAtPrice: 2150000,
    short: "Mặt nạ làm dịu, phù hợp sau treatment.",
    description: "Mặt nạ giúp làm dịu và cấp ẩm sau treatment.\n\n• Hướng dẫn: đắp 10–15 phút, 2–3 lần/tuần.\n",
    images: [],
    variants: [{ name: "Khối lượng", value: "57g" }],
  },
  {
    handle: "the-max-stem-cell-creme",
    title: "Kem Dưỡng Da Mặt The MAX Stem Cell Crème",
    brand: "The MAX", category: "Chống lão hóa",
    price: 3220000, compareAtPrice: 3705000,
    short: "Kem dưỡng cao cấp, hỗ trợ chống lão hóa.",
    description: "Kem dưỡng hỗ trợ chống lão hóa, dùng buổi tối.\n",
    images: [],
    variants: [{ name: "Khối lượng", value: "48g" }],
  },
  {
    handle: "body-spa-exfoliating-body-scrub",
    title: "Tẩy Tế Bào Chết Toàn Thân BODY SPA Exfoliating Body Scrub",
    brand: "BODY SPA", category: "Skincare",
    price: 855000, compareAtPrice: 995000,
    isBest: true,
    short: "Tẩy tế bào chết body, giúp da mịn.",
    description: "Tẩy tế bào chết toàn thân, dùng 1–2 lần/tuần.\n",
    images: [],
    variants: [{ name: "Khối lượng", value: "170g" }],
  },

  // ─── IMAGE – 25 SẢN PHẨM MỚI ──────────────────────────────────────────────
  {
    handle: "image-ageless-pure-hyaluronic-filler",
    title: "IMAGE AGELESS Total Pure Hyaluronic Filler",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 1950000, compareAtPrice: 2300000,
    isBest: true,
    short: "Serum Hyaluronic acid cô đặc, cấp ẩm sâu và căng mịn da.",
    description: "Hỗ trợ cấp ẩm sâu nhiều tầng da bằng hyaluronic acid đa phân tử.\n\n• Dùng sáng & tối sau toner.\n• Kết hợp với kem dưỡng để khóa ẩm tốt hơn.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }, { name: "Dung tích", value: "50ml" }],
  },
  {
    handle: "image-ageless-overnight-retinol-masque",
    title: "IMAGE AGELESS Total Overnight Retinol Masque",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 1760000, compareAtPrice: 2050000,
    isHot: true,
    short: "Mặt nạ ngủ retinol, phục hồi & làm mờ nếp nhăn qua đêm.",
    description: "Mặt nạ ngủ chứa retinol hoạt động trong đêm, hỗ trợ cải thiện kết cấu da.\n\n• Dùng 2–3 lần/tuần, thoa sau serum.\n• Tránh dùng cùng AHA/BHA.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "image-clear-cell-medicated-acne-lotion",
    title: "IMAGE CLEAR CELL Medicated Acne Lotion",
    brand: "IMAGE", category: "Skincare",
    price: 980000, compareAtPrice: 1150000,
    short: "Lotion trị mụn có hoạt chất y tế, giảm mụn hiệu quả.",
    description: "Lotion chứa benzoyl peroxide giúp giảm mụn viêm và mụn đầu đen.\n\n• Thoa vùng mụn sau toner.\n• Dùng buổi tối, tránh mắt.\n",
    images: [], variants: [{ name: "Dung tích", value: "60ml" }],
  },
  {
    handle: "image-clear-cell-restoring-serum",
    title: "IMAGE CLEAR CELL Restoring Serum",
    brand: "IMAGE", category: "Skincare",
    price: 1420000, compareAtPrice: 1650000,
    isBest: true,
    short: "Serum phục hồi dành cho da mụn, se khít lỗ chân lông.",
    description: "Hỗ trợ kiểm soát dầu, thu nhỏ lỗ chân lông và phục hồi da sau mụn.\n\n• Dùng sáng và tối.\n• Kết hợp CLEAR CELL Toner để tối ưu hiệu quả.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "image-iluma-brightening-serum",
    title: "IMAGE ILUMA Intense Brightening Serum",
    brand: "IMAGE", category: "Skincare",
    price: 2100000, compareAtPrice: 2450000,
    isHot: true,
    short: "Serum làm sáng mạnh, mờ đốm nâu và đều màu da.",
    description: "Công thức Vectorize-Technology™ giúp thành phần làm sáng thẩm thấu sâu hơn.\n\n• Dùng sáng & tối sau toner.\n• Phù hợp da sạm nám, đốm nâu.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "image-iluma-brightening-creme",
    title: "IMAGE ILUMA Intense Brightening Crème",
    brand: "IMAGE", category: "Skincare",
    price: 1680000, compareAtPrice: 1950000,
    short: "Kem dưỡng sáng da, giảm thâm nám hiệu quả.",
    description: "Kem dưỡng ẩm kiêm làm sáng, phù hợp da sạm và không đều màu.\n\n• Dùng buổi tối sau serum.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "image-prevention-daily-matte-spf32",
    title: "IMAGE PREVENTION+ Daily Matte Moisturizer SPF 32",
    brand: "IMAGE", category: "Skincare",
    price: 1150000, compareAtPrice: 1350000,
    isBest: true,
    short: "Kem dưỡng ẩm kiêm chống nắng SPF32, kiểm soát dầu suốt ngày.",
    description: "Kem dưỡng ban ngày kết hợp chống nắng, kiểm soát bóng dầu.\n\n• Dùng bước cuối routine sáng.\n• Phù hợp da hỗn hợp – da dầu.\n",
    images: [], variants: [{ name: "Dung tích", value: "100ml" }],
  },
  {
    handle: "image-prevention-hydrating-moisturizer-spf30",
    title: "IMAGE PREVENTION+ Daily Hydrating Moisturizer SPF 30",
    brand: "IMAGE", category: "Skincare",
    price: 1050000, compareAtPrice: 1250000,
    isHot: true,
    short: "Kem dưỡng ẩm chống nắng SPF30, cấp nước suốt ngày.",
    description: "Kem dưỡng cấp ẩm kiêm chống nắng, phù hợp da khô và bình thường.\n\n• Dùng bước cuối routine sáng.\n",
    images: [], variants: [{ name: "Dung tích", value: "100ml" }],
  },
  {
    handle: "image-ormedic-balancing-antioxidant-serum",
    title: "IMAGE ORMEDIC Balancing Antioxidant Serum",
    brand: "IMAGE", category: "Skincare",
    price: 1590000, compareAtPrice: 1850000,
    short: "Serum hữu cơ cân bằng da, chống oxy hóa từ thực vật.",
    description: "Serum thuần hữu cơ giúp cân bằng pH và bảo vệ da khỏi gốc tự do.\n\n• Phù hợp mọi loại da kể cả da nhạy cảm.\n• Dùng sáng & tối.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "image-ormedic-balancing-gel-masque",
    title: "IMAGE ORMEDIC Balancing Gel Masque",
    brand: "IMAGE", category: "Skincare",
    price: 1320000, compareAtPrice: 1550000,
    short: "Mặt nạ gel hữu cơ, làm dịu và cân bằng da nhạy cảm.",
    description: "Mặt nạ hữu cơ dịu nhẹ, phục hồi da nhạy cảm và da bị kích ứng.\n\n• Đắp 10–15 phút, không cần rửa.\n",
    images: [], variants: [{ name: "Khối lượng", value: "57g" }],
  },
  {
    handle: "image-ageless-total-eye-lift-creme",
    title: "IMAGE AGELESS Total Eye Lift Crème",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 1830000, compareAtPrice: 2150000,
    isBest: true,
    short: "Kem mắt nâng cơ, giảm bọng mắt và quầng thâm.",
    description: "Kem dưỡng vùng mắt hỗ trợ làm săn chắc và giảm bọng mắt.\n\n• Dùng sáng & tối, thoa nhẹ quanh mắt.\n",
    images: [], variants: [{ name: "Khối lượng", value: "15g" }],
  },
  {
    handle: "image-ageless-total-facial-cleanser",
    title: "IMAGE AGELESS Total Facial Cleanser",
    brand: "IMAGE", category: "Skincare",
    price: 920000, compareAtPrice: 1080000,
    short: "Sữa rửa mặt AGELESS, làm sạch nhẹ nhàng, hỗ trợ chống lão hóa.",
    description: "Sữa rửa mặt tạo bọt mịn, làm sạch mà không gây khô da.\n\n• Dùng sáng & tối.\n• Phù hợp da hỗn hợp – da thường.\n",
    images: [], variants: [{ name: "Dung tích", value: "177ml" }],
  },
  {
    handle: "image-vital-c-hydrating-repair-creme",
    title: "IMAGE VITAL C Hydrating Repair Crème",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 2050000, compareAtPrice: 2400000,
    isHot: true,
    short: "Kem dưỡng vitamin C phục hồi, cấp ẩm và sáng da.",
    description: "Kem dưỡng giàu vitamin C kết hợp peptide, phục hồi và làm sáng da.\n\n• Dùng buổi sáng và tối sau serum.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "image-vital-c-intense-moisturizer",
    title: "IMAGE VITAL C Hydrating Intense Moisturizer",
    brand: "IMAGE", category: "Skincare",
    price: 1380000, compareAtPrice: 1600000,
    short: "Kem dưỡng ẩm mạnh vitamin C, phù hợp da khô thiếu nước.",
    description: "Dưỡng ẩm sâu kết hợp vitamin C, giúp da mềm mịn và sáng khoẻ.\n\n• Phù hợp da khô, dùng buổi tối.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "image-ageless-total-retinol-a-creme",
    title: "IMAGE AGELESS Total Retinol A Crème",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 1720000, compareAtPrice: 2000000,
    isBest: true,
    short: "Kem retinol chuyên sâu, cải thiện kết cấu và đàn hồi da.",
    description: "Retinol nồng độ cao giúp tái tạo tế bào và cải thiện nếp nhăn sâu.\n\n• Chỉ dùng buổi tối.\n• Bắt đầu 1–2 lần/tuần, tăng dần.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "image-ageless-daily-moisturizer",
    title: "IMAGE AGELESS Total Daily Moisturizer",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 1250000, compareAtPrice: 1480000,
    short: "Kem dưỡng ẩm hàng ngày AGELESS, bảo vệ và chống lão hóa nhẹ.",
    description: "Kem dưỡng ngày nhẹ nhàng, cấp ẩm và hỗ trợ chống lão hóa.\n\n• Dùng buổi sáng sau serum.\n",
    images: [], variants: [{ name: "Khối lượng", value: "75g" }],
  },
  {
    handle: "image-clear-cell-clarifying-toner",
    title: "IMAGE CLEAR CELL Clarifying Toner",
    brand: "IMAGE", category: "Skincare",
    price: 780000, compareAtPrice: 920000,
    isHot: true,
    short: "Toner làm sạch sâu lỗ chân lông, kiểm soát dầu nhờn.",
    description: "Toner chứa salicylic acid giúp làm sạch và se khít lỗ chân lông.\n\n• Dùng sau sữa rửa mặt.\n• Phù hợp da dầu – da mụn.\n",
    images: [], variants: [{ name: "Dung tích", value: "120ml" }],
  },
  {
    handle: "image-iluma-intense-facial-illuminator",
    title: "IMAGE ILUMA Intense Facial Illuminator",
    brand: "IMAGE", category: "Skincare",
    price: 1460000, compareAtPrice: 1700000,
    short: "Tinh chất chiếu sáng da, cho làn da rạng rỡ tức thì.",
    description: "Illuminator giúp da trông sáng bóng và đều màu hơn ngay khi dùng.\n\n• Trộn vào kem dưỡng hoặc dùng một mình.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "image-prevention-daily-perfecting-primer-spf50",
    title: "IMAGE PREVENTION+ Daily Perfecting Primer SPF 50+",
    brand: "IMAGE", category: "Skincare",
    price: 1190000, compareAtPrice: 1400000,
    isBest: true,
    short: "Kem lót chống nắng SPF50+, làm đều màu da và bảo vệ tối ưu.",
    description: "Vừa là kem lót vừa là kem chống nắng phổ rộng SPF50+.\n\n• Dùng sau bước dưỡng da, trước makeup.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "image-ageless-total-core-cream",
    title: "IMAGE AGELESS Total Core Cream",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 2280000, compareAtPrice: 2650000,
    short: "Kem dưỡng cốt lõi chống lão hóa, phục hồi toàn diện.",
    description: "Kem dưỡng đa năng hỗ trợ đầy đủ các bước chống lão hóa trong một sản phẩm.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "image-ormedic-balancing-facial-cleanser",
    title: "IMAGE ORMEDIC Balancing Facial Cleanser",
    brand: "IMAGE", category: "Skincare",
    price: 860000, compareAtPrice: 1000000,
    short: "Sữa rửa mặt hữu cơ, cân bằng pH tự nhiên cho da.",
    description: "Sữa rửa mặt organic dịu nhẹ, phù hợp da nhạy cảm và da thường.\n\n• Không xà phòng, không paraben.\n",
    images: [], variants: [{ name: "Dung tích", value: "177ml" }],
  },
  {
    handle: "image-ageless-total-tone-texture-system",
    title: "IMAGE AGELESS Total Tone & Texture System",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 2680000, compareAtPrice: 3100000,
    isHot: true,
    short: "Hệ thống cải thiện tone da và kết cấu da toàn diện.",
    description: "Bộ sản phẩm hỗ trợ đồng đều màu da và cải thiện kết cấu nhanh chóng.\n",
    images: [], variants: [{ name: "Bộ", value: "Combo 2 món" }],
  },
  {
    handle: "image-max-stem-cell-facial-cleanser",
    title: "IMAGE MAX Stem Cell Facial Cleanser",
    brand: "IMAGE", category: "Skincare",
    price: 1080000, compareAtPrice: 1260000,
    short: "Sữa rửa mặt công nghệ tế bào gốc, làm sạch sâu và tái tạo da.",
    description: "Sữa rửa mặt tạo bọt mịn tích hợp công nghệ tế bào gốc thực vật.\n",
    images: [], variants: [{ name: "Dung tích", value: "177ml" }],
  },
  {
    handle: "image-max-stem-cell-masque",
    title: "IMAGE MAX Stem Cell Masque",
    brand: "IMAGE", category: "Chống lão hóa",
    price: 1940000, compareAtPrice: 2250000,
    isBest: true,
    short: "Mặt nạ tế bào gốc, phục hồi và tái tạo da chuyên sâu.",
    description: "Mặt nạ phục hồi chuyên sâu với công nghệ tế bào gốc và peptide.\n\n• Đắp 15–20 phút, 2 lần/tuần.\n",
    images: [], variants: [{ name: "Khối lượng", value: "57g" }],
  },

  // ─── BODY SPA – 25 SẢN PHẨM MỚI ──────────────────────────────────────────
  {
    handle: "body-spa-firming-body-serum",
    title: "BODY SPA Firming Body Serum",
    brand: "BODY SPA", category: "Chống lão hóa",
    price: 980000, compareAtPrice: 1150000,
    isHot: true,
    short: "Serum săn chắc da body, giảm da chùng và rạn nứt.",
    description: "Serum body chứa collagen và elastin, hỗ trợ kéo căng và cải thiện đàn hồi.\n\n• Thoa sau tắm, massage nhẹ theo chiều từ dưới lên.\n",
    images: [], variants: [{ name: "Dung tích", value: "200ml" }],
  },
  {
    handle: "body-spa-collagen-boost-lotion",
    title: "BODY SPA Collagen Boost Body Lotion",
    brand: "BODY SPA", category: "Bổ sung Collagen",
    price: 1050000, compareAtPrice: 1250000,
    isBest: true,
    short: "Lotion tăng cường collagen cho da toàn thân mềm mịn.",
    description: "Lotion bổ sung collagen cấp ẩm sâu và cải thiện độ đàn hồi da body.\n",
    images: [], variants: [{ name: "Dung tích", value: "500ml" }],
  },
  {
    handle: "body-spa-brightening-body-scrub",
    title: "BODY SPA Brightening Body Scrub",
    brand: "BODY SPA", category: "Skincare",
    price: 720000, compareAtPrice: 850000,
    isHot: true,
    short: "Tẩy da chết làm sáng body, giúp da đều màu và rạng rỡ.",
    description: "Tẩy da chết với hạt đường tự nhiên và vitamin C giúp làm sáng đều màu da.\n\n• Dùng 2 lần/tuần khi tắm.\n",
    images: [], variants: [{ name: "Khối lượng", value: "300g" }],
  },
  {
    handle: "body-spa-anti-cellulite-cream",
    title: "BODY SPA Anti-Cellulite Slimming Cream",
    brand: "BODY SPA", category: "Chống lão hóa",
    price: 890000, compareAtPrice: 1050000,
    short: "Kem giảm cellulite và định hình cơ thể.",
    description: "Kem massage hỗ trợ giảm mỡ và cellulite, làm thon gọn vùng đùi và bụng.\n\n• Massage ngày 2 lần.\n",
    images: [], variants: [{ name: "Khối lượng", value: "200ml" }],
  },
  {
    handle: "body-spa-hydrating-body-mask",
    title: "BODY SPA Hydrating Body Mask",
    brand: "BODY SPA", category: "Bổ sung Collagen",
    price: 650000, compareAtPrice: 780000,
    isBest: true,
    short: "Mặt nạ cấp ẩm body, phục hồi da khô và bong tróc.",
    description: "Mặt nạ body cấp ẩm chuyên sâu dành cho da khô, dùng 1 lần/tuần.\n",
    images: [], variants: [{ name: "Khối lượng", value: "250g" }],
  },
  {
    handle: "body-spa-relaxing-bath-salts",
    title: "BODY SPA Relaxing Bath Salts",
    brand: "BODY SPA", category: "Skincare",
    price: 520000, compareAtPrice: 620000,
    short: "Muối tắm thư giãn, thải độc và làm mịn da.",
    description: "Muối biển khoáng kết hợp tinh dầu thư giãn, giúp da mềm mịn sau khi tắm.\n\n• Pha 2–3 thìa vào nước tắm ấm.\n",
    images: [], variants: [{ name: "Khối lượng", value: "500g" }],
  },
  {
    handle: "body-spa-toning-body-gel",
    title: "BODY SPA Toning Body Gel",
    brand: "BODY SPA", category: "Chống lão hóa",
    price: 760000, compareAtPrice: 890000,
    isHot: true,
    short: "Gel săn chắc da body, thấm nhanh và không nhờn.",
    description: "Gel dưỡng body nhẹ nhàng, hỗ trợ săn chắc và đàn hồi da.\n\n• Thoa toàn thân sau tắm.\n",
    images: [], variants: [{ name: "Dung tích", value: "200ml" }],
  },
  {
    handle: "body-spa-nourishing-body-oil",
    title: "BODY SPA Nourishing Body Oil",
    brand: "BODY SPA", category: "Bổ sung Collagen",
    price: 830000, compareAtPrice: 980000,
    short: "Dầu dưỡng body nuôi dưỡng sâu, giúp da óng ả.",
    description: "Dầu body thực vật tự nhiên cấp ẩm và làm mềm da toàn thân.\n\n• Thoa sau tắm hoặc dùng massage.\n",
    images: [], variants: [{ name: "Dung tích", value: "100ml" }],
  },
  {
    handle: "body-spa-stretch-mark-cream",
    title: "BODY SPA Stretch Mark Cream",
    brand: "BODY SPA", category: "Bổ sung Collagen",
    price: 920000, compareAtPrice: 1080000,
    isBest: true,
    short: "Kem mờ rạn da, phục hồi và tái tạo vùng da rạn.",
    description: "Kem hỗ trợ làm mờ vết rạn và cải thiện đàn hồi da vùng bụng, đùi.\n\n• Massage 2 lần/ngày trong 8–12 tuần.\n",
    images: [], variants: [{ name: "Khối lượng", value: "200ml" }],
  },
  {
    handle: "body-spa-cooling-leg-gel",
    title: "BODY SPA Cooling Leg Gel",
    brand: "BODY SPA", category: "Skincare",
    price: 580000, compareAtPrice: 690000,
    short: "Gel mát lạnh cho chân mệt mỏi, giảm phù nề và nặng chân.",
    description: "Gel chứa menthol và chiết xuất ngựa hạt dẻ, làm mát và giảm phù nề chân.\n\n• Thoa từ bàn chân lên đầu gối, massage nhẹ.\n",
    images: [], variants: [{ name: "Dung tích", value: "150ml" }],
  },
  {
    handle: "body-spa-vitamin-c-body-serum",
    title: "BODY SPA Vitamin C Body Serum",
    brand: "BODY SPA", category: "Skincare",
    price: 1120000, compareAtPrice: 1320000,
    isHot: true,
    short: "Serum vitamin C cho body, làm sáng và đều màu da toàn thân.",
    description: "Serum body tập trung vitamin C giúp làm đều màu và sáng da toàn thân.\n",
    images: [], variants: [{ name: "Dung tích", value: "200ml" }],
  },
  {
    handle: "body-spa-collagen-hand-cream",
    title: "BODY SPA Collagen Hand Cream",
    brand: "BODY SPA", category: "Bổ sung Collagen",
    price: 420000, compareAtPrice: 500000,
    isBest: true,
    short: "Kem tay collagen, dưỡng mềm và chăm sóc da tay khô.",
    description: "Kem tay cung cấp collagen và dưỡng ẩm sâu, giúp tay mềm mịn.\n\n• Dùng sau mỗi lần rửa tay.\n",
    images: [], variants: [{ name: "Khối lượng", value: "75g" }],
  },
  {
    handle: "body-spa-brightening-underarm-cream",
    title: "BODY SPA Brightening Underarm Cream",
    brand: "BODY SPA", category: "Skincare",
    price: 480000, compareAtPrice: 580000,
    short: "Kem làm sáng vùng nách, giảm thâm và dưỡng ẩm.",
    description: "Kem chuyên biệt làm sáng và dưỡng ẩm vùng nách bị thâm.\n\n• Thoa sau tắm, để khô trước khi mặc áo.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "body-spa-deep-moisturizing-body-butter",
    title: "BODY SPA Deep Moisturizing Body Butter",
    brand: "BODY SPA", category: "Bổ sung Collagen",
    price: 680000, compareAtPrice: 800000,
    isHot: true,
    short: "Bơ dưỡng thể cấp ẩm sâu, phù hợp da cực kỳ khô.",
    description: "Bơ dưỡng thể đậm đặc với shea butter và collagen, phù hợp da rất khô.\n\n• Thoa sau tắm khi da còn ẩm.\n",
    images: [], variants: [{ name: "Khối lượng", value: "200g" }],
  },
  {
    handle: "body-spa-exfoliating-sugar-scrub",
    title: "BODY SPA Exfoliating Sugar Scrub",
    brand: "BODY SPA", category: "Skincare",
    price: 610000, compareAtPrice: 720000,
    isBest: true,
    short: "Tẩy da chết đường mía tự nhiên, nhẹ nhàng và hiệu quả.",
    description: "Tẩy da chết với hạt đường mía tự nhiên và dầu dừa, dịu nhẹ cho da nhạy cảm.\n",
    images: [], variants: [{ name: "Khối lượng", value: "250g" }],
  },
  {
    handle: "body-spa-revitalizing-body-mist",
    title: "BODY SPA Revitalizing Body Mist",
    brand: "BODY SPA", category: "Skincare",
    price: 390000, compareAtPrice: 470000,
    short: "Xịt thơm dưỡng ẩm body, làm tươi mát da suốt ngày.",
    description: "Body mist cấp ẩm nhẹ và để lại hương thơm dễ chịu lâu dài.\n\n• Xịt toàn thân sau tắm hoặc bất cứ lúc nào.\n",
    images: [], variants: [{ name: "Dung tích", value: "200ml" }],
  },
  {
    handle: "body-spa-slimming-massage-cream",
    title: "BODY SPA Slimming Massage Cream",
    brand: "BODY SPA", category: "Chống lão hóa",
    price: 750000, compareAtPrice: 890000,
    short: "Kem massage thon gọn, đốt cháy mỡ thừa và làm săn da.",
    description: "Kem massage kết hợp tinh dầu giúp hỗ trợ đốt mỡ và làm thon gọn.\n\n• Massage 5–10 phút mỗi ngày vùng bụng, đùi.\n",
    images: [], variants: [{ name: "Khối lượng", value: "200ml" }],
  },
  {
    handle: "body-spa-skin-tightening-serum",
    title: "BODY SPA Skin Tightening Serum",
    brand: "BODY SPA", category: "Chống lão hóa",
    price: 1180000, compareAtPrice: 1380000,
    isBest: true,
    short: "Serum kéo căng da body, cải thiện đàn hồi sau giảm cân.",
    description: "Serum hỗ trợ kéo căng da chùng sau giảm cân hoặc sau sinh.\n\n• Thoa ngày 2 lần, massage đều tay.\n",
    images: [], variants: [{ name: "Dung tích", value: "150ml" }],
  },
  {
    handle: "body-spa-anti-aging-body-lotion",
    title: "BODY SPA Anti-Aging Body Lotion",
    brand: "BODY SPA", category: "Chống lão hóa",
    price: 850000, compareAtPrice: 990000,
    isHot: true,
    short: "Lotion chống lão hóa body, giúp da trẻ trung và căng bóng.",
    description: "Lotion body chuyên biệt chống lão hóa, phục hồi và bảo vệ da.\n",
    images: [], variants: [{ name: "Dung tích", value: "400ml" }],
  },
  {
    handle: "body-spa-collagen-gel-mask",
    title: "BODY SPA Collagen Gel Mask Body",
    brand: "BODY SPA", category: "Bổ sung Collagen",
    price: 560000, compareAtPrice: 670000,
    short: "Mặt nạ gel collagen cho body, cấp ẩm và phục hồi da.",
    description: "Mặt nạ gel collagen dành riêng cho da body, đặc biệt vùng da khô.\n",
    images: [], variants: [{ name: "Khối lượng", value: "150g" }],
  },
  {
    handle: "body-spa-radiance-body-lotion",
    title: "BODY SPA Radiance Body Lotion",
    brand: "BODY SPA", category: "Skincare",
    price: 780000, compareAtPrice: 920000,
    short: "Lotion dưỡng da rạng rỡ, cho làn da sáng bóng tự nhiên.",
    description: "Lotion body với hạt ngọc trai nano tạo lớp sáng mịn tự nhiên.\n",
    images: [], variants: [{ name: "Dung tích", value: "400ml" }],
  },
  {
    handle: "body-spa-intensive-repair-body-cream",
    title: "BODY SPA Intensive Repair Body Cream",
    brand: "BODY SPA", category: "Bổ sung Collagen",
    price: 940000, compareAtPrice: 1100000,
    isBest: true,
    short: "Kem dưỡng phục hồi da body chuyên sâu, dành cho da hư tổn.",
    description: "Kem phục hồi tập trung cho da tay, chân và vùng da bị khô nứt nẻ.\n",
    images: [], variants: [{ name: "Khối lượng", value: "200ml" }],
  },
  {
    handle: "body-spa-herbal-body-wrap",
    title: "BODY SPA Herbal Body Wrap",
    brand: "BODY SPA", category: "Skincare",
    price: 690000, compareAtPrice: 820000,
    short: "Kem ủ thảo mộc toàn thân, thải độc và nuôi dưỡng da.",
    description: "Ủ body với thảo mộc thiên nhiên, giúp da mịn màng và thư giãn cơ thể.\n\n• Thoa đều, ủ 20–30 phút rồi rửa sạch.\n",
    images: [], variants: [{ name: "Khối lượng", value: "250g" }],
  },
  {
    handle: "body-spa-detox-mud-wrap",
    title: "BODY SPA Detox Mud Wrap",
    brand: "BODY SPA", category: "Skincare",
    price: 740000, compareAtPrice: 870000,
    isHot: true,
    short: "Kem bùn thải độc tố, làm sạch và tái tạo da toàn thân.",
    description: "Bùn khoáng tự nhiên hút độc tố và bã nhờn, da trở nên sạch và mịn hơn.\n",
    images: [], variants: [{ name: "Khối lượng", value: "300g" }],
  },
  {
    handle: "body-spa-firming-bust-cream",
    title: "BODY SPA Firming Bust Cream",
    brand: "BODY SPA", category: "Chống lão hóa",
    price: 1050000, compareAtPrice: 1230000,
    short: "Kem săn chắc vùng ngực, cải thiện đàn hồi và hình dáng.",
    description: "Kem chuyên biệt hỗ trợ nâng cơ và cải thiện độ đàn hồi vùng ngực và vòng 1.\n",
    images: [], variants: [{ name: "Khối lượng", value: "150ml" }],
  },

  // ─── MD – 20 SẢN PHẨM MỚI ─────────────────────────────────────────────────
  {
    handle: "md-lifting-eye-complex",
    title: "MD Lifting Eye Complex",
    brand: "MD", category: "Chống lão hóa",
    price: 1650000, compareAtPrice: 1950000,
    isBest: true,
    short: "Serum mắt nâng cơ, giảm nếp nhăn và quầng thâm.",
    description: "Serum vùng mắt với peptide nâng cơ và caffeine giảm bọng và thâm.\n\n• Thoa sáng & tối quanh vùng mắt.\n",
    images: [], variants: [{ name: "Dung tích", value: "15ml" }],
  },
  {
    handle: "md-sensitive-skin-cleanser",
    title: "MD Sensitive Skin Cleanser",
    brand: "MD", category: "Skincare",
    price: 740000, compareAtPrice: 870000,
    isHot: true,
    short: "Sữa rửa mặt cho da nhạy cảm, không kích ứng và dịu nhẹ.",
    description: "Sữa rửa mặt dịu nhẹ pH cân bằng, không gây kích ứng cho da nhạy cảm.\n",
    images: [], variants: [{ name: "Dung tích", value: "177ml" }],
  },
  {
    handle: "md-regenerating-serum",
    title: "MD Regenerating Serum",
    brand: "MD", category: "Chống lão hóa",
    price: 2150000, compareAtPrice: 2500000,
    isHot: true,
    short: "Serum tái sinh da chuyên sâu, cải thiện tổng thể bề mặt da.",
    description: "Serum tái sinh chứa EGF và retinol, hỗ trợ tái cấu trúc da từ bên trong.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "md-calming-repair-cream",
    title: "MD Calming Repair Cream",
    brand: "MD", category: "Skincare",
    price: 1380000, compareAtPrice: 1620000,
    isBest: true,
    short: "Kem làm dịu và phục hồi da bị kích ứng hoặc sau điều trị.",
    description: "Kem làm dịu nhanh da đỏ và kích ứng sau laser, peel hoặc điều trị y khoa.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "md-anti-redness-serum",
    title: "MD Anti-Redness Serum",
    brand: "MD", category: "Skincare",
    price: 1560000, compareAtPrice: 1820000,
    short: "Serum giảm đỏ da, phù hợp da nhạy cảm và rosacea.",
    description: "Serum hỗ trợ giảm đỏ và ổn định da nhạy cảm, rosacea.\n\n• Dùng sáng & tối sau toner.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "md-hydrating-facial-mist",
    title: "MD Hydrating Facial Mist",
    brand: "MD", category: "Skincare",
    price: 620000, compareAtPrice: 740000,
    isHot: true,
    short: "Xịt khoáng cấp ẩm, làm dịu da mọi lúc mọi nơi.",
    description: "Xịt khoáng dưỡng ẩm tức thì, phù hợp dùng trước/sau makeup.\n",
    images: [], variants: [{ name: "Dung tích", value: "150ml" }],
  },
  {
    handle: "md-brightening-spot-treatment",
    title: "MD Brightening Spot Treatment",
    brand: "MD", category: "Skincare",
    price: 980000, compareAtPrice: 1150000,
    short: "Serum chấm điểm làm sáng đốm nâu và thâm sau mụn.",
    description: "Serum trị điểm chứa niacinamide và arbutin, mờ thâm và đốm nâu hiệu quả.\n\n• Chấm trực tiếp lên vùng thâm.\n",
    images: [], variants: [{ name: "Dung tích", value: "15ml" }],
  },
  {
    handle: "md-post-procedure-cream",
    title: "MD Post-Procedure Cream",
    brand: "MD", category: "Skincare",
    price: 1450000, compareAtPrice: 1700000,
    isBest: true,
    short: "Kem phục hồi sau thủ thuật thẩm mỹ, làm dịu và tái tạo da.",
    description: "Kem phục hồi chuyên biệt sau laser, peel, microneedling và các thủ thuật da.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "md-advanced-peptide-complex",
    title: "MD Advanced Peptide Complex",
    brand: "MD", category: "Chống lão hóa",
    price: 2380000, compareAtPrice: 2780000,
    isHot: true,
    short: "Serum peptide tiên tiến, hỗ trợ tái tạo collagen và đàn hồi da.",
    description: "Tổ hợp 8 peptide tác động đa lớp, hỗ trợ trẻ hóa da toàn diện.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "md-collagen-boosting-serum",
    title: "MD Collagen Boosting Serum",
    brand: "MD", category: "Bổ sung Collagen",
    price: 1980000, compareAtPrice: 2300000,
    isBest: true,
    short: "Serum kích thích sản sinh collagen, cải thiện đàn hồi da.",
    description: "Serum hỗ trợ tổng hợp collagen type I và III từ bên trong da.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "md-gentle-foaming-cleanser",
    title: "MD Gentle Foaming Cleanser",
    brand: "MD", category: "Skincare",
    price: 680000, compareAtPrice: 800000,
    short: "Sữa rửa mặt tạo bọt mịn, làm sạch nhẹ nhàng mọi loại da.",
    description: "Sữa rửa tạo bọt nhẹ, làm sạch hiệu quả mà không làm mất ẩm da.\n",
    images: [], variants: [{ name: "Dung tích", value: "177ml" }],
  },
  {
    handle: "md-barrier-repair-moisturizer",
    title: "MD Barrier Repair Moisturizer",
    brand: "MD", category: "Skincare",
    price: 1280000, compareAtPrice: 1500000,
    isHot: true,
    short: "Kem phục hồi hàng rào bảo vệ da, phù hợp da nhạy cảm.",
    description: "Kem dưỡng phục hồi lipid barrier cho da nhạy cảm và da bị tổn thương.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "md-vitamin-b5-hydrating-serum",
    title: "MD Vitamin B5 Hydrating Serum",
    brand: "MD", category: "Skincare",
    price: 1120000, compareAtPrice: 1320000,
    isBest: true,
    short: "Serum B5 cấp ẩm sâu, phục hồi da sau khi dùng retinol hay AHA.",
    description: "Serum panthenol (B5) nồng độ cao, cấp ẩm và phục hồi da tổn thương.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "md-retinol-renewal-cream",
    title: "MD Retinol Renewal Cream",
    brand: "MD", category: "Chống lão hóa",
    price: 1680000, compareAtPrice: 1980000,
    short: "Kem retinol tái tạo da, cải thiện texture và tông da.",
    description: "Kem retinol dành cho da mới bắt đầu và da nhạy cảm, nồng độ thấp ổn định.\n\n• Dùng tối 2–3 lần/tuần.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "md-firming-neck-cream",
    title: "MD Firming Neck Cream",
    brand: "MD", category: "Chống lão hóa",
    price: 1420000, compareAtPrice: 1680000,
    short: "Kem săn chắc vùng cổ, giảm da chùng và nếp nhăn cổ.",
    description: "Kem chuyên biệt vùng cổ với peptide nâng cơ và retinol nhẹ.\n\n• Thoa từ ngực lên cổ, sáng & tối.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "md-daily-defense-spf30",
    title: "MD Daily Defense Moisturizer SPF 30",
    brand: "MD", category: "Skincare",
    price: 950000, compareAtPrice: 1120000,
    isHot: true,
    short: "Kem dưỡng ẩm bảo vệ hàng ngày SPF30, nhẹ nhàng cho da nhạy cảm.",
    description: "Kem dưỡng ẩm ban ngày tích hợp chống nắng, dịu nhẹ cho da nhạy cảm.\n",
    images: [], variants: [{ name: "Dung tích", value: "100ml" }],
  },
  {
    handle: "md-intensive-eye-serum",
    title: "MD Intensive Eye Serum",
    brand: "MD", category: "Chống lão hóa",
    price: 1350000, compareAtPrice: 1580000,
    isBest: true,
    short: "Serum mắt chuyên sâu, xóa nếp nhăn và làm dày vùng da mắt.",
    description: "Serum mắt nồng độ cao với retinol và peptide, dành cho da mắt lão hóa.\n",
    images: [], variants: [{ name: "Dung tích", value: "15ml" }],
  },
  {
    handle: "md-skin-resurfacing-masque",
    title: "MD Skin Resurfacing Masque",
    brand: "MD", category: "Skincare",
    price: 1180000, compareAtPrice: 1380000,
    short: "Mặt nạ tái cấu trúc bề mặt da, làm mịn và sáng da.",
    description: "Mặt nạ AHA/BHA nhẹ giúp tẩy tế bào chết hóa học và làm mịn da.\n\n• Dùng 1–2 lần/tuần.\n",
    images: [], variants: [{ name: "Khối lượng", value: "57g" }],
  },
  {
    handle: "md-antioxidant-defense-serum",
    title: "MD Antioxidant Defense Serum",
    brand: "MD", category: "Skincare",
    price: 1850000, compareAtPrice: 2180000,
    isHot: true,
    short: "Serum chống oxy hóa đa tầng, bảo vệ da khỏi tác nhân môi trường.",
    description: "Serum với vitamin C, E và ferulic acid bảo vệ da khỏi ô nhiễm và UV.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "md-moisture-surge-cream",
    title: "MD Moisture Surge Cream",
    brand: "MD", category: "Bổ sung Collagen",
    price: 1060000, compareAtPrice: 1250000,
    isBest: true,
    short: "Kem dưỡng ẩm bùng nổ, cấp nước tức thì cho da khô.",
    description: "Kem dưỡng ẩm mạnh dùng được cả ngày và đêm, đặc biệt phù hợp da khô.\n",
    images: [], variants: [{ name: "Khối lượng", value: "75g" }],
  },

  // ─── THE MAX – 15 SẢN PHẨM MỚI ───────────────────────────────────────────
  {
    handle: "the-max-stem-cell-eye-creme",
    title: "The MAX Stem Cell Eye Crème",
    brand: "The MAX", category: "Chống lão hóa",
    price: 2850000, compareAtPrice: 3300000,
    isBest: true,
    short: "Kem mắt tế bào gốc cao cấp, xóa nếp nhăn và nâng vùng mắt.",
    description: "Kem mắt với công nghệ tế bào gốc thực vật và peptide nâng cơ cao cấp.\n\n• Thoa nhẹ sáng & tối quanh mắt.\n",
    images: [], variants: [{ name: "Khối lượng", value: "15g" }],
  },
  {
    handle: "the-max-stem-cell-facial-cleanser",
    title: "The MAX Stem Cell Facial Cleanser",
    brand: "The MAX", category: "Skincare",
    price: 1350000, compareAtPrice: 1580000,
    isHot: true,
    short: "Sữa rửa mặt tế bào gốc, làm sạch và kích thích tái tạo da.",
    description: "Sữa rửa cao cấp tích hợp tế bào gốc thực vật, dưỡng ẩm khi làm sạch.\n",
    images: [], variants: [{ name: "Dung tích", value: "177ml" }],
  },
  {
    handle: "the-max-stem-cell-masque",
    title: "The MAX Stem Cell Masque with Vectorize Technology",
    brand: "The MAX", category: "Chống lão hóa",
    price: 2680000, compareAtPrice: 3100000,
    isBest: true,
    short: "Mặt nạ tế bào gốc công nghệ Vectorize, phục hồi da chuyên sâu.",
    description: "Mặt nạ hàng đầu dùng công nghệ Vectorize-Technology™ để tối ưu thẩm thấu.\n\n• Đắp 15–20 phút, 2–3 lần/tuần.\n",
    images: [], variants: [{ name: "Khối lượng", value: "57g" }],
  },
  {
    handle: "the-max-stem-cell-neck-decollete",
    title: "The MAX Stem Cell Neck Décolleté",
    brand: "The MAX", category: "Chống lão hóa",
    price: 2950000, compareAtPrice: 3400000,
    short: "Kem cổ và ngực tế bào gốc, săn chắc và chống lão hóa cao cấp.",
    description: "Kem chuyên biệt vùng cổ – ngực với tế bào gốc và peptide tái tạo.\n",
    images: [], variants: [{ name: "Khối lượng", value: "75ml" }],
  },
  {
    handle: "the-max-stem-cell-serum",
    title: "The MAX Stem Cell Serum",
    brand: "The MAX", category: "Chống lão hóa",
    price: 3850000, compareAtPrice: 4450000,
    isHot: true,
    short: "Serum tế bào gốc đỉnh cao, trẻ hóa da toàn diện.",
    description: "Serum cao cấp nhất dòng The MAX, tích hợp tế bào gốc và peptide thế hệ mới.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "the-max-anti-aging-lip-complex",
    title: "The MAX Anti-Aging Lip Enhancement Complex",
    brand: "The MAX", category: "Chống lão hóa",
    price: 1580000, compareAtPrice: 1850000,
    short: "Serum môi chống lão hóa, căng mọng và xóa nếp nhăn quanh miệng.",
    description: "Serum chuyên biệt vùng môi với peptide và hyaluronic acid, làm căng mọng môi.\n",
    images: [], variants: [{ name: "Dung tích", value: "8ml" }],
  },
  {
    handle: "the-max-stem-cell-hand-body-creme",
    title: "The MAX Stem Cell Hand and Body Crème",
    brand: "The MAX", category: "Bổ sung Collagen",
    price: 1850000, compareAtPrice: 2150000,
    isBest: true,
    short: "Kem tay và body tế bào gốc cao cấp, nuôi dưỡng và chống lão hóa.",
    description: "Kem body cao cấp dòng The MAX, tái tạo và làm trẻ da toàn thân.\n",
    images: [], variants: [{ name: "Khối lượng", value: "100g" }],
  },
  {
    handle: "the-max-3d-fusion-foam-cleanser",
    title: "The MAX 3D Fusion Foam Cleanser",
    brand: "The MAX", category: "Skincare",
    price: 1480000, compareAtPrice: 1730000,
    isHot: true,
    short: "Sữa rửa mặt bọt 3D, làm sạch sâu và thúc đẩy tái tạo da.",
    description: "Sữa rửa mặt tạo bọt phong phú, tích hợp tế bào gốc và enzyme làm sạch sâu.\n",
    images: [], variants: [{ name: "Dung tích", value: "150ml" }],
  },
  {
    handle: "the-max-lifting-face-serum",
    title: "The MAX Lifting and Sculpting Face Serum",
    brand: "The MAX", category: "Chống lão hóa",
    price: 3580000, compareAtPrice: 4150000,
    isBest: true,
    short: "Serum nâng cơ và tạo đường nét khuôn mặt, công nghệ tế bào gốc.",
    description: "Serum tập trung nâng cơ mặt và cải thiện đường nét V-line.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "the-max-contour-peptide-serum",
    title: "The MAX Contour Peptide Serum",
    brand: "The MAX", category: "Chống lão hóa",
    price: 3180000, compareAtPrice: 3680000,
    short: "Serum peptide định hình khuôn mặt, cải thiện đường viền và cằm.",
    description: "Serum peptide cao cấp hỗ trợ định hình và nâng cơ toàn khuôn mặt.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "the-max-total-repair-daily-defense-spf25",
    title: "The MAX Total Repair Daily Defense SPF 25",
    brand: "The MAX", category: "Skincare",
    price: 1680000, compareAtPrice: 1980000,
    isHot: true,
    short: "Kem dưỡng bảo vệ hàng ngày SPF25, phù hợp da đang điều trị.",
    description: "Kem bảo vệ và dưỡng ẩm đồng thời chống nắng, phù hợp da sau điều trị.\n",
    images: [], variants: [{ name: "Dung tích", value: "100ml" }],
  },
  {
    handle: "the-max-trifection-serum",
    title: "The MAX TriFection Serum",
    brand: "The MAX", category: "Chống lão hóa",
    price: 4200000, compareAtPrice: 4900000,
    isBest: true,
    short: "Serum 3 tầng tác động cao cấp nhất dòng The MAX, đỉnh cao trẻ hóa.",
    description: "Serum ba lớp tác động độc lập: tái tạo, nâng cơ và bảo vệ – đỉnh cao công nghệ.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "the-max-stem-cell-recovery-serum",
    title: "The MAX Stem Cell Recovery Serum",
    brand: "The MAX", category: "Chống lão hóa",
    price: 3650000, compareAtPrice: 4250000,
    isHot: true,
    short: "Serum phục hồi tế bào gốc sau điều trị da chuyên sâu.",
    description: "Serum phục hồi cao cấp dùng sau laser, peel sâu và các thủ thuật chuyên sâu.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "the-max-brightening-serum",
    title: "The MAX Brightening Serum",
    brand: "The MAX", category: "Skincare",
    price: 2850000, compareAtPrice: 3300000,
    short: "Serum làm sáng cao cấp The MAX, đều màu và rạng rỡ da.",
    description: "Serum làm sáng cao cấp với niacinamide, arbutin và tế bào gốc.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "the-max-stem-cell-brightening-creme",
    title: "The MAX Stem Cell Brightening Crème",
    brand: "The MAX", category: "Chống lão hóa",
    price: 3120000, compareAtPrice: 3600000,
    isBest: true,
    short: "Kem làm sáng tế bào gốc, xóa đốm nâu và chống lão hóa.",
    description: "Kem dưỡng cao cấp kết hợp tế bào gốc và thành phần làm sáng để đều màu da.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },

  // ─── VITAL C – 15 SẢN PHẨM MỚI ───────────────────────────────────────────
  {
    handle: "vital-c-hydrating-facial-cleanser",
    title: "VITAL C Hydrating Facial Cleanser",
    brand: "VITAL C", category: "Skincare",
    price: 820000, compareAtPrice: 970000,
    isBest: true,
    short: "Sữa rửa mặt vitamin C dưỡng ẩm, làm sáng da khi làm sạch.",
    description: "Sữa rửa mặt vitamin C giúp làm sạch nhẹ nhàng và đồng thời dưỡng ẩm.\n",
    images: [], variants: [{ name: "Dung tích", value: "177ml" }],
  },
  {
    handle: "vital-c-hydrating-eye-recovery-creme",
    title: "VITAL C Hydrating Eye Recovery Crème",
    brand: "VITAL C", category: "Chống lão hóa",
    price: 1480000, compareAtPrice: 1750000,
    isHot: true,
    short: "Kem mắt vitamin C phục hồi, giảm thâm và nếp nhăn.",
    description: "Kem mắt với vitamin C và peptide, hỗ trợ làm sáng và phục hồi vùng da mắt.\n",
    images: [], variants: [{ name: "Khối lượng", value: "15g" }],
  },
  {
    handle: "vital-c-hydrating-intense-moisturizer-spf30",
    title: "VITAL C Hydrating Intense Moisturizer SPF 30",
    brand: "VITAL C", category: "Skincare",
    price: 1180000, compareAtPrice: 1380000,
    isBest: true,
    short: "Kem dưỡng ẩm vitamin C tích hợp SPF30, bảo vệ và sáng da.",
    description: "Kem dưỡng ẩm chống nắng vitamin C phổ rộng, phù hợp dùng ban ngày.\n",
    images: [], variants: [{ name: "Dung tích", value: "100ml" }],
  },
  {
    handle: "vital-c-hydrating-facial-mist",
    title: "VITAL C Hydrating Facial Mist",
    brand: "VITAL C", category: "Skincare",
    price: 580000, compareAtPrice: 690000,
    isHot: true,
    short: "Xịt khoáng vitamin C, cấp ẩm và làm tươi da tức thì.",
    description: "Xịt khoáng giàu vitamin C, tươi mát và cấp ẩm tức thì bất cứ lúc nào.\n",
    images: [], variants: [{ name: "Dung tích", value: "150ml" }],
  },
  {
    handle: "vital-c-vitamin-c-spot-treatment",
    title: "VITAL C Vitamin C Spot Treatment",
    brand: "VITAL C", category: "Skincare",
    price: 920000, compareAtPrice: 1080000,
    short: "Serum chấm điểm vitamin C, mờ đốm nâu và thâm sau mụn.",
    description: "Serum tập trung vitamin C nồng độ cao, chấm trực tiếp vùng thâm và đốm nâu.\n",
    images: [], variants: [{ name: "Dung tích", value: "15ml" }],
  },
  {
    handle: "vital-c-hydrating-mask",
    title: "VITAL C Hydrating Mask",
    brand: "VITAL C", category: "Skincare",
    price: 680000, compareAtPrice: 800000,
    isBest: true,
    short: "Mặt nạ vitamin C dưỡng ẩm, phục hồi và sáng da.",
    description: "Mặt nạ cấp ẩm sâu với vitamin C, phù hợp dùng 2–3 lần/tuần.\n",
    images: [], variants: [{ name: "Khối lượng", value: "57g" }],
  },
  {
    handle: "vital-c-glow-enhancer",
    title: "VITAL C Glow Enhancer",
    brand: "VITAL C", category: "Skincare",
    price: 1250000, compareAtPrice: 1480000,
    isHot: true,
    short: "Tinh chất khuếch đại độ sáng, cho làn da rạng rỡ tức thì.",
    description: "Tinh chất làm sáng tức thì, có thể trộn vào kem dưỡng hoặc dùng độc lập.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }],
  },
  {
    handle: "vital-c-brightening-body-lotion",
    title: "VITAL C Brightening Body Lotion",
    brand: "VITAL C", category: "Bổ sung Collagen",
    price: 780000, compareAtPrice: 920000,
    isBest: true,
    short: "Lotion body vitamin C làm sáng toàn thân và bổ sung collagen.",
    description: "Lotion body vitamin C kết hợp collagen, làm đều và sáng màu da toàn thân.\n",
    images: [], variants: [{ name: "Dung tích", value: "400ml" }],
  },
  {
    handle: "vital-c-energizing-toner",
    title: "VITAL C Energizing Toner",
    brand: "VITAL C", category: "Skincare",
    price: 750000, compareAtPrice: 880000,
    short: "Toner vitamin C cấp năng lượng cho da, cân bằng pH và sáng da.",
    description: "Toner chứa vitamin C và niacinamide, cân bằng và chuẩn bị da hấp thụ serum.\n",
    images: [], variants: [{ name: "Dung tích", value: "120ml" }],
  },
  {
    handle: "vital-c-daily-defense-spf50",
    title: "VITAL C Daily Defense SPF 50+",
    brand: "VITAL C", category: "Skincare",
    price: 1380000, compareAtPrice: 1620000,
    isHot: true,
    short: "Kem chống nắng vitamin C SPF50+, bảo vệ và sáng da tối ưu.",
    description: "Kem chống nắng phổ rộng SPF50+ với vitamin C, bảo vệ và dưỡng da đồng thời.\n",
    images: [], variants: [{ name: "Dung tích", value: "100ml" }],
  },
  {
    handle: "vital-c-brightening-exfoliant",
    title: "VITAL C Brightening Exfoliant",
    brand: "VITAL C", category: "Skincare",
    price: 1080000, compareAtPrice: 1280000,
    isBest: true,
    short: "Tẩy da chết hóa học vitamin C, làm mờ đốm nâu và sáng da.",
    description: "Tẩy da chết AHA kết hợp vitamin C giúp làm sáng và đều màu da.\n\n• Dùng 2–3 lần/tuần, tránh dùng buổi sáng nếu không thoa kem chống nắng.\n",
    images: [], variants: [{ name: "Dung tích", value: "60ml" }],
  },
  {
    handle: "vital-c-nourishing-night-cream",
    title: "VITAL C Nourishing Night Cream",
    brand: "VITAL C", category: "Chống lão hóa",
    price: 1650000, compareAtPrice: 1930000,
    isHot: true,
    short: "Kem đêm vitamin C nuôi dưỡng, phục hồi và làm sáng da qua đêm.",
    description: "Kem đêm giàu vitamin C và retinol nhẹ, phục hồi và làm đều màu da.\n\n• Dùng buổi tối sau serum.\n",
    images: [], variants: [{ name: "Khối lượng", value: "50g" }],
  },
  {
    handle: "vital-c-brightening-lip-balm",
    title: "VITAL C Brightening Lip Balm",
    brand: "VITAL C", category: "Skincare",
    price: 320000, compareAtPrice: 390000,
    short: "Son dưỡng môi vitamin C, làm hồng và dưỡng mềm môi.",
    description: "Son dưỡng vitamin C giúp làm hồng tự nhiên và dưỡng ẩm môi suốt ngày.\n",
    images: [], variants: [{ name: "Khối lượng", value: "4g" }],
  },
  {
    handle: "vital-c-hydrating-anti-aging-serum",
    title: "VITAL C Hydrating Anti-Aging Serum",
    brand: "VITAL C", category: "Chống lão hóa",
    price: 2180000, compareAtPrice: 2550000,
    isBest: true,
    short: "Serum vitamin C chống lão hóa, cấp ẩm sâu và làm sáng da.",
    description: "Serum kép vừa chống lão hóa vừa làm sáng, chứa vitamin C và hyaluronic acid.\n",
    images: [], variants: [{ name: "Dung tích", value: "30ml" }, { name: "Dung tích", value: "50ml" }],
  },
  {
    handle: "vital-c-hydrating-recovery-masque",
    title: "VITAL C Hydrating Recovery Masque",
    brand: "VITAL C", category: "Bổ sung Collagen",
    price: 920000, compareAtPrice: 1080000,
    isHot: true,
    short: "Mặt nạ phục hồi vitamin C, cấp collagen và dưỡng ẩm đậm đặc.",
    description: "Mặt nạ cấp collagen và vitamin C, dùng sau khi da bị kích ứng hoặc khô căng.\n",
    images: [], variants: [{ name: "Khối lượng", value: "57g" }],
  },
];

async function main() {
  // Reset demo
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.marketplaceLink.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.file.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  for (const c of CATEGORIES) {
    await prisma.category.create({ data: c });
  }

  const brandNames = Array.from(new Set(PRODUCTS.map((p) => p.brand)));
  for (const b of brandNames) {
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
        imageHint: null,
        isHot: !!p.isHot,
        isBest: !!p.isBest,
        flashSaleEndsAt: p.flashSaleEndsAt ? new Date(p.flashSaleEndsAt) : null,
        youtubeUrl: p.youtubeUrl ?? null,
        brandId: brand.id,
        categoryId: category.id,
      },
    });

    const imgs = (p.images ?? []).filter((x) => (x || "").trim().length > 0);
    for (let i = 0; i < imgs.length; i++) {
      const url = imgs[i];
      const f = await prisma.file.upsert({
        where: { url },
        update: {},
        create: { url, kind: "IMAGE", name: url.split("/").pop() || null },
      });
      await prisma.productImage.create({
        data: { productId: created.id, fileId: f.id, sortOrder: i },
      });
    }

    const variants = p.variants ?? [];
    if (!variants.length) {
      await prisma.variant.create({
        data: {
          productId: created.id,
          name: "Biến thể", value: "Tiêu chuẩn",
          price: p.price, compareAt: p.compareAtPrice ?? null,
          stock: 50, sortOrder: 0,
        },
      });
    } else {
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        await prisma.variant.create({
          data: {
            productId: created.id,
            name: v.name, value: v.value,
            price: v.price ?? p.price,
            compareAt: v.compareAt ?? p.compareAtPrice ?? null,
            stock: v.stock ?? 50,
            sku: v.sku ?? null,
            sortOrder: i,
          },
        });
      }
    }

    const links = p.marketplaces ?? [];
    for (let i = 0; i < links.length; i++) {
      const m = links[i];
      await prisma.marketplaceLink.create({
        data: { productId: created.id, platform: m.platform, productUrl: m.productUrl, sortOrder: i },
      });
    }
  }

  console.log(`✅ Seed done — ${PRODUCTS.length} sản phẩm`);

  // ─── Sample Orders ─────────────────────────────────────────────────────────
  // Lấy tất cả sản phẩm theo danh mục để tạo đơn mẫu thực tế
  const skincareProds    = await prisma.product.findMany({ where: { category: { name: "Skincare" } }, include: { variants: true } });
  const collagenProds    = await prisma.product.findMany({ where: { category: { name: "Bổ sung Collagen" } }, include: { variants: true } });
  const antiagingProds   = await prisma.product.findMany({ where: { category: { name: "Chống lão hóa" } }, include: { variants: true } });

  const now = new Date();
  const thisMonth = (daysAgo) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);

  const PLATFORMS = ["shopee", "lazada", "tiki", "website"];

  // Helper: tạo đơn hàng có nhiều item
  async function seedOrder(platform, daysAgo, items) {
    const order = await prisma.order.create({
      data: {
        platform,
        externalId: `${platform.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        orderedAt: thisMonth(daysAgo),
        status: "completed",
      },
    });
    for (const { product, qty } of items) {
      const v = product.variants[0];
      if (!v) continue;
      await prisma.orderItem.create({
        data: { orderId: order.id, productId: product.id, variantId: v.id, quantity: qty, price: v.price },
      });
    }
  }

  // Skincare — nhiều nhất (tháng hiện tại)
  for (let i = 0; i < 18; i++) {
    const prod = skincareProds[i % skincareProds.length];
    await seedOrder(PLATFORMS[i % 4], i, [{ product: prod, qty: Math.floor(Math.random() * 4) + 1 }]);
  }

  // Chống lão hóa — đứng thứ hai
  for (let i = 0; i < 11; i++) {
    const prod = antiagingProds[i % antiagingProds.length];
    await seedOrder(PLATFORMS[i % 4], i, [{ product: prod, qty: Math.floor(Math.random() * 3) + 1 }]);
  }

  // Bổ sung Collagen — ít nhất
  for (let i = 0; i < 5; i++) {
    const prod = collagenProds[i % collagenProds.length];
    await seedOrder("shopee", i, [{ product: prod, qty: 1 }]);
  }

  console.log(`✅ Sample orders seeded`);

  // ─── Admin Auth Seed ───────────────────────────────────────────────────────
  // Idempotent: upsert role + user
  const adminRole = await prisma.aspNetRoles.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      normalizedName: "ADMIN",
      concurrencyStamp: crypto.randomUUID(),
    },
  });

  const passwordHash = await bcrypt.hash("Admin@123456", 10);
  const adminUser = await prisma.aspNetUsers.upsert({
    where: { email: "admin@oanhspa.com" },
    update: {},
    create: {
      userName: "admin@oanhspa.com",
      normalizedUserName: "ADMIN@OANHSPA.COM",
      email: "admin@oanhspa.com",
      normalizedEmail: "ADMIN@OANHSPA.COM",
      emailConfirmed: true,
      passwordHash,
      securityStamp: crypto.randomUUID(),
      concurrencyStamp: crypto.randomUUID(),
    },
  });

  // Assign Admin role
  await prisma.aspNetUserRoles.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log(`✅ Admin user seeded: admin@oanhspa.com / Admin@123456`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
