"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterForm({ t }: { t: any }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("Şifreler eşleşmiyor!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/accounts/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          email: email,
          password: password,
          role: "sales" // veya backend'in beklediği değer
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        // Kayıttan sonra login sayfasına yönlendir
        router.push("/");
      } else {
        setError(data.error || "Kayıt başarısız.");
      }
    } catch (err) {
      setLoading(false);
      setError("Sunucuya ulaşılamıyor. Daha sonra tekrar deneyin.");
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleRegister}>
      {error && (
        <div className="bg-red-50 text-red-700 p-2 rounded text-sm">{error}</div>
      )}
      {/* E-posta */}
      <div>
        <label className="block mb-2 text-base font-semibold text-gray-800">{t.email}</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
            <Mail size={20} strokeWidth={1.5} />
          </span>
          <input
            type="email"
            className="w-full h-12 rounded-xl border border-gray-200 bg-[#f9fafb] py-3 pl-12 pr-3 focus:outline-none focus:ring-2 focus:ring-[#002D72] placeholder-gray-400 shadow-sm transition"
            placeholder="name@.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>
      {/* Şifre */}
      <div>
        <label className="block mb-2 text-base font-semibold text-gray-800">{t.password}</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
            <Lock size={20} strokeWidth={1.5} />
          </span>
          <input
            type={showPass ? "text" : "password"}
            className="w-full h-12 rounded-xl border border-gray-200 bg-[#f9fafb] py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#002D72] placeholder-gray-400 shadow-sm transition"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 focus:outline-none"
            tabIndex={-1}
            onClick={() => setShowPass(s => !s)}
            aria-label={showPass ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showPass ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
      {/* Şifre Tekrar */}
      <div>
        <label className="block mb-2 text-base font-semibold text-gray-800">{t.password2}</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
            <Lock size={20} strokeWidth={1.5} />
          </span>
          <input
            type={showPass2 ? "text" : "password"}
            className="w-full h-12 rounded-xl border border-gray-200 bg-[#f9fafb] py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#002D72] placeholder-gray-400 shadow-sm transition"
            placeholder="••••••••"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 focus:outline-none"
            tabIndex={-1}
            onClick={() => setShowPass2(s => !s)}
            aria-label={showPass2 ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showPass2 ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
      {/* Kayıt Butonu */}
      <button
        type="submit"
        className="w-full h-12 mt-2 bg-[#002D72] hover:bg-[#00205C] text-white rounded-xl shadow-lg font-bold text-base transition-all duration-150"
        style={{ letterSpacing: '.02em' }}
        disabled={loading}
      >
        {loading ? "..." : t.registerBtn}
      </button>
    </form>
  );
}
