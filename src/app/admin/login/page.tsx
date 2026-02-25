"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type Step = "password" | "mfa";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp]         = useState("");
  const [step, setStep]         = useState<Step>("password");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

    const result = await signIn("credentials", {
      email,
      password,
      totp: step === "mfa" ? totp : "",
      redirect: false,
    });

    setLoading(false);

    if (!result?.error) {
      window.location.href = callbackUrl;
      return;
    }

    if (result.error === "MFA_REQUIRED") {
      setStep("mfa");
      setTotp("");
      return;
    }

    if (result.error === "MFA_INVALID") {
      setError("Mã xác thực không đúng hoặc đã hết hạn.");
      return;
    }

    setError("Email hoặc mật khẩu không đúng.");
  }

  const inputCls = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold">Oanh SPA</div>
          <div className="text-sm text-zinc-500 mt-1">Admin Panel</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === "password" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className={inputCls}
                  placeholder="admin@oanhspa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="••••••••"
                />
              </div>
            </>
          ) : (
            <div>
              <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
                Tài khoản này bật xác thực 2 bước. Nhập mã từ ứng dụng Authenticator.
              </div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Mã xác thực (6 chữ số)</label>
              <input
                type="text"
                inputMode="numeric"
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                autoFocus
                maxLength={6}
                className={`${inputCls} tracking-[0.4em] text-center text-lg font-mono`}
                placeholder="000000"
              />
              <button
                type="button"
                onClick={() => { setStep("password"); setError(""); }}
                className="mt-2 text-xs text-zinc-400 hover:text-zinc-600"
              >
                ← Quay lại
              </button>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || (step === "mfa" && totp.length < 6)}
            className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang xử lý..." : step === "mfa" ? "Xác nhận" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
