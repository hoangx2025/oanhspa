export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold">Liên hệ</h1>
        <p className="mt-3 text-sm opacity-75">Form liên hệ (demo).</p>

        <form className="mt-6 grid gap-3 max-w-xl">
          <input className="rounded-xl border px-4 py-3" placeholder="Họ và tên" />
          <input className="rounded-xl border px-4 py-3" placeholder="Số điện thoại" />
          <input className="rounded-xl border px-4 py-3" placeholder="Email" />
          <textarea className="rounded-xl border px-4 py-3" placeholder="Nội dung" rows={5} />
          <button className="rounded-xl bg-zinc-900 px-5 py-3 text-white">Gửi</button>
        </form>
      </div>
    </main>
  );
}
