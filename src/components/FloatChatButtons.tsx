const links = [
  { label: "Zalo", href: "https://zalo.me/84901234567" },
  { label: "Messenger", href: "https://m.me/yourpageusername" },
];

export default function FloatChatButtons() {
  return (
    <div style={{ position: "fixed", right: 18, bottom: 18, zIndex: 60, display: "grid", gap: 10 }}>
      {links.map((x) => (
        <a
          key={x.label}
          href={x.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#18181b",
            color: "white",
            padding: "12px 14px",
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,.18)",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {x.label}
        </a>
      ))}
    </div>
  );
}