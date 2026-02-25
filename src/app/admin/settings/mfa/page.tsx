"use client";

import { useEffect, useState } from "react";

type Status = "loading" | "disabled" | "setup" | "verify" | "enabled" | "disabling";

export default function MfaSettingsPage() {
  const [status, setStatus]       = useState<Status>("loading");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [secret, setSecret]       = useState("");
  const [code, setCode]           = useState("");
  const [error, setError]         = useState("");
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    fetch("/api/admin/mfa/status")
      .then((r) => r.json())
      .then((d) => setStatus(d.enabled ? "enabled" : "disabled"));
  }, []);

  async function startSetup() {
    setError(""); setSaving(true);
    const res = await fetch("/api/admin/mfa/setup", { method: "POST" });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setQrDataUrl(data.qrDataUrl);
    setSecret(data.secret);
    setCode("");
    setStatus("setup");
  }

  async function verifyAndEnable() {
    setError(""); setSaving(true);
    const res = await fetch("/api/admin/mfa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setCode("");
    setStatus("enabled");
  }

  async function disableMfa() {
    setError(""); setSaving(true);
    const res = await fetch("/api/admin/mfa/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setCode("");
    setStatus("disabled");
  }

  const inputCls = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400";

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Xác thực 2 bước (MFA)</h1>

      {status === "loading" && (
        <div className="text-sm text-zinc-400">Đang tải...</div>
      )}

      {/* ── Đã bật ─────────────────────────────────── */}
      {(status === "enabled" || status === "disabling") && (
        <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Đã bật
            </span>
          </div>
          <p className="text-sm text-zinc-600">
            Tài khoản đang được bảo vệ bằng xác thực 2 bước. Mỗi lần đăng nhập bạn cần nhập mã từ ứng dụng Authenticator.
          </p>

          {status === "disabling" ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-600">Nhập mã xác thực để xác nhận tắt MFA:</p>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                autoFocus
                className={`${inputCls} tracking-[0.4em] text-center text-lg font-mono`}
                placeholder="000000"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={disableMfa}
                  disabled={saving || code.length < 6}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? "Đang xử lý..." : "Xác nhận tắt"}
                </button>
                <button
                  onClick={() => { setStatus("enabled"); setCode(""); setError(""); }}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setStatus("disabling"); setCode(""); setError(""); }}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Tắt xác thực 2 bước
            </button>
          )}
        </div>
      )}

      {/* ── Chưa bật ────────────────────────────────── */}
      {status === "disabled" && (
        <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Chưa bật
            </span>
          </div>
          <p className="text-sm text-zinc-600">
            Bật xác thực 2 bước để tăng bảo mật cho tài khoản. Bạn cần cài ứng dụng{" "}
            <strong>Google Authenticator</strong> hoặc <strong>Authy</strong> trên điện thoại.
          </p>
          <button
            onClick={startSetup}
            disabled={saving}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {saving ? "Đang tạo mã..." : "Bật xác thực 2 bước"}
          </button>
        </div>
      )}

      {/* ── Bước 1: Quét QR ─────────────────────────── */}
      {status === "setup" && (
        <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-5">
          <div>
            <h2 className="font-semibold text-zinc-800 mb-1">Bước 1 — Quét mã QR</h2>
            <p className="text-sm text-zinc-500">Mở ứng dụng Authenticator và quét mã QR bên dưới.</p>
          </div>

          {qrDataUrl && (
            <div className="flex justify-center">
              <img src={qrDataUrl} alt="QR code MFA" className="w-48 h-48 border rounded-xl p-2" />
            </div>
          )}

          <details className="text-xs text-zinc-400">
            <summary className="cursor-pointer hover:text-zinc-600">Nhập thủ công thay vì quét QR</summary>
            <div className="mt-2 rounded-lg bg-zinc-50 border px-3 py-2 font-mono break-all select-all">
              {secret}
            </div>
          </details>

          <div className="border-t pt-4 space-y-3">
            <h2 className="font-semibold text-zinc-800">Bước 2 — Nhập mã xác nhận</h2>
            <p className="text-sm text-zinc-500">Nhập mã 6 chữ số từ ứng dụng để xác nhận thiết lập.</p>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              autoFocus
              className={`${inputCls} tracking-[0.4em] text-center text-lg font-mono`}
              placeholder="000000"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={verifyAndEnable}
                disabled={saving || code.length < 6}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {saving ? "Đang xác nhận..." : "Kích hoạt"}
              </button>
              <button
                onClick={() => { setStatus("disabled"); setCode(""); setError(""); }}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
