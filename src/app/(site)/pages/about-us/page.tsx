import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Giới thiệu về OANH SPA - Chuyên cung cấp mỹ phẩm xách tay Hàn Quốc chính hãng, uy tín, giá tốt nhất.",
  alternates: { canonical: "/pages/about-us" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold">Giới thiệu</h1>
        <p className="mt-3 text-sm opacity-75">
          Đây là trang giới thiệu (demo). Bạn có thể thay nội dung theo cửa hàng của bạn.
        </p>
      </div>
    </main>
  );
}
