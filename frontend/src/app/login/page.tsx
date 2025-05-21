"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard"); // Zaten giriş yaptıysa login sayfasını atla
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm
        t={{
          email: "E-posta",
          password: "Şifre",
          remember: "Beni hatırla",
          loginBtn: "Giriş yap",
          forgot: "Şifremi unuttum",
        }}
      />
    </div>
  );
}
