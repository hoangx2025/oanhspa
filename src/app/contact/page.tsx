export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-white p-8 shadow-soft text-center">
        <h1 className="text-3xl font-semibold">Liên hệ</h1>

        <p className="mt-6 text-base leading-relaxed">
          Quý khách hàng vui lòng liên hệ trực tiếp qua số điện thoại{" "}
          {/* <span className="font-semibold">09xx xxx xxx</span>{" "} */}
          hoặc qua{" "}
          <a
            href="https://zalo.me/84901234567"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-rose-600"
          >
            Zalo
          </a>{" "}
          và{" "}
          <a
            href="https://m.me/yourpageusername"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-rose-600"
          >
            Messenger
          </a>.
        </p>
      </div>
    </main>
  );
}