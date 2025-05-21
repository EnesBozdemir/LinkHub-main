"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

// Dil çeviri objeleri
const translations = {
  tr: {
    platform: "LinkedIn Data Yönetimi Platformu",
    platformWord: "Platformu",
    desc: "Birden fazla LinkedIn hesabını bağlayın ve farklı hesaplardan gelen dataları tek panel üzerinden yönetin.",
    multi: "Çoklu hesap yönetimi",
    real: "Gerçek zamanlı veri analizi",
    secure: "Güvenli ve uyumlu",
    login: "Giriş",
    register: "Kayıt",
    email: "E-posta",
    password: "Şifre",
    password2: "Şifre (tekrar)",
    remember: "Beni hatırla",
    loginBtn: "Giriş Yap",
    forgot: "Şifrenizi mi unuttunuz?",
    registerBtn: "Kayıt Ol",
  },
  en: {
    platform: "LinkedIn Data Management Platform",
    platformWord: "Platform",
    desc: "Connect multiple LinkedIn accounts and manage all your data from a single dashboard.",
    multi: "Multi-account management",
    real: "Real-time data analytics",
    secure: "Secure and compliant",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    password2: "Password (repeat)",
    remember: "Remember me",
    loginBtn: "Sign In",
    forgot: "Forgot your password?",
    registerBtn: "Register",
  },
};

export default function HomePage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const t = translations[lang];

  function toggleLanguage() {
    setLang(lang === "tr" ? "en" : "tr");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafd] to-[#f4f6fa]">
      {/* Header */}
      <header className="relative flex items-center justify-center p-6 border-b">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 mx-auto transition-transform duration-300 hover:scale-110 hover:rotate-2"
          style={{ cursor: "pointer" }}
        />
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-gray-100 transition"
          onClick={toggleLanguage}
          aria-label="Change language"
        >
          🌐
        </button>
      </header>

      {/* Main */}
      <main className="flex flex-1 justify-center items-center px-4">
        {/* Info Section */}
        <div className="hidden md:flex flex-col flex-1 justify-center items-start pr-16">
          <h1 className="text-4xl font-extrabold mb-4 text-[#00205C]">
            LinkedIn{" "}
            <span className="text-red-600">
              {lang === "tr" ? "Data Yönetimi" : "Data Management"}
              <br />
              {t.platformWord}
            </span>
          </h1>
          <p className="text-lg text-gray-700 mb-6">{t.desc}</p>
          <ul className="space-y-2 text-gray-700 text-base">
            <li>✅ {t.multi}</li>
            <li>✅ {t.real}</li>
            <li>✅ {t.secure}</li>
          </ul>
        </div>

        {/* Auth Card */}
        <div className="flex-1 max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
            {/* Sekme */}
            <div className="flex justify-between gap-2 mb-6">
              <button
                className={`flex-1 py-2 font-semibold rounded-lg transition ${tab === "login"
                  ? "bg-[#00205C] text-white"
                  : "bg-gray-100 text-gray-700"
                  }`}
                onClick={() => setTab("login")}
              >
                {t.login}
              </button>
              <button
                className={`flex-1 py-2 font-semibold rounded-lg transition ${tab === "register"
                  ? "bg-[#00205C] text-white"
                  : "bg-gray-100 text-gray-700"
                  }`}
                onClick={() => setTab("register")}
              >
                {t.register}
              </button>
            </div>
            {tab === "login" ? <LoginForm t={t} /> : <RegisterForm t={t} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 mt-12 text-xs text-gray-500 border-t">
        <img src="/logo.png" alt="Logo" className="h-6 mx-auto mb-1" />
        Atatürk, Feza Sok. No:3, 34758 Ataşehir/İstanbul, Türkiye <br />
        <span className="block mt-1">
          © This website is powered by Phyix Technologies. Tüm hakları saklıdır.
        </span>
      </footer>
    </div>
  );
}

