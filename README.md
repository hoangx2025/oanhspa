# Next.js OANH SPA-like Demo (DB)

This project is a demo inspired by the layout of Haravan theme "Beauty Cosmetic - Làm Đẹp".

✅ Sản phẩm/biến thể/thương hiệu được lấy **trực tiếp từ database** qua Prisma:
- Demo: **SQLite** (file `dev.db`)
- Prod: chuyển sang **MySQL** chỉ bằng cách đổi `DATABASE_URL`

## Run
```bash
npm i
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Environment
- Copy `.env.example` -> `.env`
- Demo SQLite: `DATABASE_URL="file:./dev.db"`
- MySQL (prod): `DATABASE_URL="mysql://user:pass@host:3306/oanhspa"`

## Pages
- `/` home (hero, hot week, flash sale, best seller tabs)
- `/collections/[handle]` collection pages
- `/products/[handle]` product detail
- `/blogs`, `/pages/about-us`, `/contact`

## Notes
- Mục **Thương hiệu** ở Home đã được làm đầy đủ: có list brand + panel hiển thị sản phẩm theo brand (load qua API).
- Trang chi tiết sản phẩm có: slider ảnh + video YouTube, hiển thị biến thể, và nút **Mua ngay** theo `marketplaces`.
