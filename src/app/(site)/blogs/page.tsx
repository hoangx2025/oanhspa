import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức, mẹo làm đẹp, review mỹ phẩm Hàn Quốc mới nhất từ OANH SPA.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-white p-12 shadow-soft text-center">
        <h1 className="text-3xl font-semibold">Tin tức</h1>

        <div className="mt-8">
          <div className="text-lg font-medium">
            Hiện chưa có bài viết nào
          </div>

          <p className="mt-3 text-sm opacity-70">
            Quý khách vui lòng quay lại sau.
          </p>
        </div>
      </div>
    </main>
  );
}
