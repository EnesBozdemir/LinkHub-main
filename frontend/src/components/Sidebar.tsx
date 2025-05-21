import React from "react";
import Link from "next/link";

type UserInfo = {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

type SidebarProps = {
  user: UserInfo | null;
};

export default function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="flex flex-col bg-[#0a2148] w-[260px] min-h-screen py-4 px-3">
      {/* Logo */}
      <div className="mb-8">
        <img src="/logo.png" alt="Logo" className="h-12 mx-auto" />
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1">
        <SidebarLink icon="🏠" text="Dashboard" href="/" />
        <SidebarLink
          icon="🔗"
          text="LinkedIn Accounts"
          href="/linkedin-accounts"
        />
        <SidebarLink icon="📅" text="Calendar" href="/calendar" />
        <SidebarLink icon="✉️" text="Inbox" href="/inbox" />
      </nav>

      {/* Profile & Logout */}
      <div className="mt-auto pt-6 border-t border-[#1a3058]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-300 rounded-full w-10 h-10" />
          <div>
            <div className="text-white font-semibold text-lg">
              {user
                ? `${user.first_name || user.username} ${user.last_name || ""}`
                : "Kullanıcı"}
            </div>
            <div className="text-[#c0d0e0] text-xs mt-1">
              {user ? user.email : ""}
            </div>
            <div className="text-[#ffe066] text-xs font-bold mt-1">
              {user?.role === "admin"
                ? "Admin"
                : user?.role === "sales"
                ? "Sales Person"
                : ""}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 ml-1 mt-4">
          <button
            type="button"
            onClick={() => {
              // Burada kendi ayarlar route'una yönlendirebilirsin
              window.location.href = "/settings";
            }}
            className="flex items-center gap-2 text-[#b5c8e6] hover:text-white text-sm transition"
          >
            <span>⚙️</span> Settings
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("access_token");
              window.location.href = "/"; // Ana sayfaya yönlendir
            }}
            className="flex items-center gap-2 text-[#b5c8e6] hover:text-white text-sm transition"
          >
            <span>↩️</span> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  icon,
  text,
  href = "#",
  active = false,
}: {
  icon: string;
  text: string;
  href?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-5 py-3 rounded-lg font-medium ${
        active
          ? "bg-[#06265c] text-white"
          : "text-[#b5c8e6] hover:bg-[#183572] hover:text-white transition"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}
