"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

// Chrome tip tanımlamaları
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage: (extensionId: string, message: any, callback?: (response: any) => void) => void;
        lastError?: { message: string };
      };
    };
  }
}

export default function LoginForm({ t }: { t: any }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const EXTENSION_ID = "fcdbkigaiodfdocbfimeneacoklhoiob";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.access && data.refresh) {
        console.log("🔥 Login başarılı, token alındı:", data);

        // LocalStorage'a token'ları kaydet
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user_email", email);

        // Extension'a gönderilecek token
        console.log("🚀 Extension'a token gönderiliyor:", data.access);

        window.chrome?.runtime?.sendMessage(
          EXTENSION_ID,
          { type: "SAVE_TOKEN", token: data.access },
          (response: any) => {
            if (window.chrome?.runtime?.lastError) {
              console.error(
                "❌ Extension sendMessage hatası:",
                window.chrome.runtime.lastError.message
              );
            } else {
              console.log("✅ Extension cevabı:", response);
            }
          }
        );

        // Extension token'ı okuyana kadar kısa gecikme (opsiyonel)
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push("/dashboard");
      } else {
        setError(data?.error || "Giriş başarısız. Bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      console.error("⛔ Sunucu hatası:", err);
      setLoading(false);
      setError("Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.");
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleLogin}>
      {error && (
        <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* E-posta */}
      <div>
        <label className="block mb-2 text-base font-semibold text-gray-800">
          {t.email}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
            <Mail size={20} strokeWidth={1.5} />
          </span>
          <input
            type="email"
            className="w-full h-12 rounded-xl border border-gray-200 bg-[#f9fafb] py-3 pl-12 pr-3 focus:outline-none focus:ring-2 focus:ring-[#002D72] placeholder-gray-400 shadow-sm transition"
            placeholder="name@.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* Şifre */}
      <div>
        <label className="block mb-2 text-base font-semibold text-gray-800">
          {t.password}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
            <Lock size={20} strokeWidth={1.5} />
          </span>
          <input
            type={showPass ? "text" : "password"}
            className="w-full h-12 rounded-xl border border-gray-200 bg-[#f9fafb] py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#002D72] placeholder-gray-400 shadow-sm transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 focus:outline-none"
            tabIndex={-1}
            onClick={() => setShowPass((prev) => !prev)}
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Beni hatırla */}
      <div className="flex items-center gap-2 mt-2">
        <input
          id="remember"
          type="checkbox"
          className="accent-[#002D72] w-5 h-5 rounded-full border-gray-300 border-2"
          checked={remember}
          onChange={() => setRemember((v) => !v)}
        />
        <label
          htmlFor="remember"
          className="text-sm text-gray-700 cursor-pointer"
        >
          {t.remember}
        </label>
      </div>

      {/* Giriş butonu */}
      <button
        type="submit"
        className="w-full h-12 mt-2 bg-[#002D72] hover:bg-[#00205C] text-white rounded-xl shadow-lg font-bold text-base transition"
        disabled={loading}
      >
        {loading ? "..." : t.loginBtn}
      </button>

      {/* Şifremi unuttum */}
      <div className="text-center text-xs text-[#002D72] mt-2 cursor-pointer hover:underline font-medium">
        {t.forgot}
      </div>
    </form>
  );
}
