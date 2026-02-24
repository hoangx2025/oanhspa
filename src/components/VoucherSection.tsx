"use client";

import { useState, useEffect } from "react";

export default function VoucherSection({
  shopeeUrl,
  productTitle,
}: {
  shopeeUrl?: string;
  productTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const shareCaption = productTitle
    ? `Mình vừa tìm được ${productTitle} tại Oanh SPA — mỹ phẩm xách tay chính hãng giá tốt! Bạn nào quan tâm tham khảo nhé 👇`
    : "Khám phá mỹ phẩm xách tay chính hãng tại Oanh SPA! 👇";

  const fbShareUrl =
    `https://www.facebook.com/sharer/sharer.php` +
    `?u=${encodeURIComponent(pageUrl)}` +
    `&quote=${encodeURIComponent(shareCaption)}`;

  return (
    <>
      {/* Nút lấy voucher */}
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-full rounded-xl border border-dashed border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition"
      >
        Lấy voucher giảm giá (lên đến 10%)
      </button>

      {/* Popup */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition text-lg font-semibold"
            >
              ×
            </button>

            <div className="text-base font-semibold">Hướng dẫn lấy voucher</div>

            {/* 1. Điều kiện áp dụng */}
            <div className="text-xs font-semibold uppercase tracking-widest text-rose-600 mt-6">
              1. Điều kiện áp dụng
            </div>
            <p className="mt-1.5 text-sm opacity-80">
              Chỉ áp dụng khi mua sản phẩm{" "}
              <span className="font-semibold text-zinc-900">
                trực tiếp tại cửa hàng
              </span>
              .
            </p>

            {/* 2. Cách lấy voucher */}
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-rose-600">
                2. Cách lấy voucher
              </div>
              <p className="mt-1 text-xs opacity-60">
                Chọn 1 trong 2 cách dưới đây:
              </p>

              <div className="mt-3 grid gap-3">
                {/* Cách 1: Facebook */}
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-semibold">
                    Cách 1 — Share Facebook
                  </div>
                  <ol className="mt-2 space-y-1.5 text-sm opacity-70">
                    <li className="flex gap-2">
                      <span className="shrink-0 font-medium text-zinc-500">
                        1.
                      </span>
                      <span>
                        Share link sản phẩm lên Facebook ở chế độ{" "}
                        <span className="font-medium text-zinc-900">
                          Public
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 font-medium text-zinc-500">
                        2.
                      </span>
                      <span>Chụp màn hình và gửi shop</span>
                    </li>
                  </ol>
                  <a
                    href={fbShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#1877f2] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                    </svg>
                    Share lên Facebook
                  </a>
                </div>

                {/* Cách 2: Shopee */}
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-semibold">
                    Cách 2 — Theo dõi Shopee
                  </div>
                  <ol className="mt-2 space-y-1.5 text-sm opacity-70">
                    <li className="flex gap-2">
                      <span className="shrink-0 font-medium text-zinc-500">
                        1.
                      </span>
                      <span>Bấm vào link để chuyển hướng sang Shopee</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 font-medium text-zinc-500">
                        2.
                      </span>
                      <span>
                        Bấm{" "}
                        <span className="font-medium text-zinc-900">
                          Theo dõi shop
                        </span>{" "}
                        và thêm sản phẩm vào giỏ hàng
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 font-medium text-zinc-500">
                        3.
                      </span>
                      <span>Chụp màn hình và gửi shop</span>
                    </li>
                  </ol>
                  {shopeeUrl ? (
                    <a
                      href={shopeeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#ee4d2d] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM6 17.25C6 15.18 8.7 13.5 12 13.5s6 1.68 6 3.75v.75H6v-.75z" />
                      </svg>
                      Mở Shopee
                    </a>
                  ) : (
                    <div className="mt-3 text-center text-xs opacity-50">
                      Chưa có link Shopee cho sản phẩm này.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-4   text-xs opacity-50">
              Sau khi hoàn thành, gửi ảnh chụp màn hình cho shop để nhận
              voucher.
            </p>
             <p className="mt-1 font-semibold    text-rose-600" style={{fontSize:"0.7rem"}}>
               * Giá trị voucher shop cung cấp không lớn hơn giá trị voucher hiện tại trên sàn
            </p>
          </div>
        </div>
      )}
    </>
  );
}
