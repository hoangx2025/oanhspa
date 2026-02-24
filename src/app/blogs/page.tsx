export default function BlogsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold">Tin tức</h1>
        <p className="mt-2 text-sm opacity-70">Trang blog (mô phỏng). Bạn có thể fix cứng bài viết trong data/posts.ts.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl border overflow-hidden bg-white">
              <div className="h-40 bg-gradient-to-br from-zinc-100 to-white" />
              <div className="p-4">
                <div className="text-xs opacity-60">09.01.2021</div>
                <div className="mt-1 font-semibold">Bài viết demo #{i}</div>
                <div className="mt-2 text-sm opacity-70">Mô tả ngắn cho bài viết…</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
