import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-semibold text-lg">F1GENZ<span className="text-rose-500">.</span></div>
          <p className="mt-3 text-sm opacity-80">
            Demo giao diện (Next.js) mô phỏng bố cục theme mỹ phẩm: header, flash sale, tab bán chạy, blog, footer.
          </p>
        </div>
        <div>
          <div className="font-semibold">Về chúng tôi</div>
          <div className="mt-3 grid gap-2 text-sm">
            <Link className="hover:text-rose-600" href="/pages/about-us">Giới thiệu</Link>
            <Link className="hover:text-rose-600" href="/blogs">Tin tức</Link>
            <Link className="hover:text-rose-600" href="/contact">Liên hệ</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold">Danh mục</div>
          <div className="mt-3 grid gap-2 text-sm">
            <Link className="hover:text-rose-600" href="/collections/my-pham">Mỹ phẩm</Link>
            <Link className="hover:text-rose-600" href="/collections/san-pham-ban-chay">Bán chạy</Link>
            <Link className="hover:text-rose-600" href="/collections/flash-sale">Flash Sale</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold">Liên hệ</div>
          <div className="mt-3 text-sm opacity-80 grid gap-1">
            <div>Hotline: 1900 0000</div>
            <div>Email: support@example.com</div>
            <div>Giờ làm việc: T2–T6 (9:00–17:30)</div>
          </div>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Demo only • Không phải theme chính thức
      </div>
    </footer>
  );
}
