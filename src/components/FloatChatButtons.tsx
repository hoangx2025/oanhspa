"use client";

const ZALO_LINK =
  process.env.NEXT_PUBLIC_ZALO_LINK || "https://zalo.me/84901234567";
const MESSENGER_LINK =
  process.env.NEXT_PUBLIC_MESSENGER_LINK || "https://m.me/yourpageusername";
const HOTLINE =
  process.env.NEXT_PUBLIC_HOTLINE || "0901234567";

const items = [
  {
    label: "Hotline",
    href: `tel:${HOTLINE}`,
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    bg: "#e11d48",
  },
  {
    label: "Zalo",
    href: ZALO_LINK,
    icon: (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src="https://zalo-site.zadn.vn/_next/static/media/logo.a68785cd.svg"
        alt="Zalo"
        width={30}
        height={30}
        className="rounded-full"
      />
    ),
    bg: "#fff",
  },
  {
    label: "Messenger",
    href: MESSENGER_LINK,
    icon: (
      <svg viewBox="0 0 48 48" width="30" height="30" fill="none">
        <defs>
          <linearGradient id="fb-msg" x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00C6FF" />
            <stop offset="1" stopColor="#0068FF" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="24" fill="url(#fb-msg)" />
        <path d="M24 10c-8.284 0-15 5.934-15 13.254 0 4.17 2.04 7.89 5.228 10.326V39l5.093-2.795A15.87 15.87 0 0 0 24 37.088c8.284 0 15-5.934 15-13.254S32.284 10 24 10z" fill="#fff" />
        <path d="M16.5 27l5.5-8 4 4 5.5-8" stroke="url(#fb-msg)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: "transparent",
  },
];

export default function FloatChatButtons() {
  return (
    <div className="fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3">
      {items.map((x) => (
        <a
          key={x.label}
          href={x.href}
          target={x.href.startsWith("tel:") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          title={x.label}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-110 overflow-hidden"
          style={{ background: x.bg, border:"0.5px solid #cbcbcb" }}
        >
          {x.icon}
        </a>
      ))}
    </div>
  );
}
