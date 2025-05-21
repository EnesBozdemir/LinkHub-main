"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("access_token");
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  return res;
};

type UserInfo = {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

type LinkedInAccount = {
  id: number;
  email: string;
  li_at_cookie: string;
};

export default function DashboardPage() {
  const [tab, setTab] = useState("Overview");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accounts, setAccounts] = useState<LinkedInAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [liInput, setLiInput] = useState("");
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalReplies, setTotalReplies] = useState(0);

  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetchWithAuth("http://localhost:8000/api/accounts/me/").then(res => res.json()),
      fetchWithAuth("http://localhost:8000/api/linkedin/my-accounts/").then(res => res.json()),
      fetchWithAuth("http://localhost:8000/api/linkedin/messages/").then(res => res.json()),
      fetchWithAuth("http://localhost:8000/api/linkedin/my-replies/").then(res => res.json()),
    ])
      .then(([userData, accountData, messagesData, repliesData]) => {
        setUser(userData);
        setAccounts(accountData);
        setTotalMessages(messagesData.length);
        setTotalReplies(repliesData.length);
      })
      .catch((err) => {
        if (err.message === "UNAUTHORIZED") {
          router.replace("/login");
        } else {
          console.error("Beklenmeyen hata:", err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchWithAuth("http://localhost:8000/api/linkedin/save/", {
      method: "POST",
      body: JSON.stringify({ email: emailInput, li_at_cookie: liInput }),
    });
    if (res.ok) {
      setEmailInput("");
      setLiInput("");
      const updated = await fetchWithAuth("http://localhost:8000/api/linkedin/my-accounts/").then(r => r.json());
      setAccounts(updated);
    }
  };

  const chartData = [
    { name: "Gelen Mesajlar", value: totalMessages },
    { name: "Gönderilen Cevaplar", value: totalReplies },
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f9fb]">
      <Sidebar user={user} />

      <main className="flex-1 px-12 py-8">
        <div className="flex items-center gap-3 mb-8">
          {["Overview", "Analytics", "Reports"].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                tab === item
                  ? "bg-white shadow text-[#00205C]"
                  : "text-gray-500 hover:text-[#00205C] transition"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <StatCard title="Gelen Mesajlar" value={totalMessages} desc="Tüm zamanlar" dot="bg-blue-500" />
          <StatCard title="Gönderilen Cevaplar" value={totalReplies} desc="Tüm zamanlar" dot="bg-purple-500" />
        </div>

        <div className="mt-10 bg-white shadow rounded-2xl p-8">
          <div className="font-bold text-lg mb-6">📊 Mesaj İstatistikleri</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0a2148" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-10 bg-white shadow rounded-2xl p-8">
          <div className="font-bold text-lg mb-4">Bağlı LinkedIn Hesapların</div>
          {loading ? (
            <div className="text-gray-400">Yükleniyor...</div>
          ) : accounts.length > 0 ? (
            <ul className="space-y-3 mb-8">
              {accounts.map((acc) => (
                <li key={acc.id} className="flex items-center gap-3">
                  <span className="text-[#0a2148] font-medium">{acc.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 mb-8">Henüz hesabın yok</div>
          )}
        </div>

        <div className="mt-10 bg-white shadow rounded-2xl p-8">
          <div className="font-bold text-lg mb-4">Yeni LinkedIn Hesabı Ekle</div>
          <form onSubmit={handleAddAccount} className="space-y-4">
            <input
              type="email"
              placeholder="LinkedIn e-posta"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
            <input
              type="text"
              placeholder="li_at cookie"
              value={liInput}
              onChange={(e) => setLiInput(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Hesabı Ekle
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

// --- Sidebar ve yardımcı bileşenler ---
function Sidebar({ user }: { user: UserInfo | null }) {
  return (
    <aside className="flex flex-col bg-[#0a2148] w-[260px] min-h-screen py-4 px-3">
      <div className="mb-8">
        <img src="/" alt="" className="h-12 mx-auto" />
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        <SidebarLink icon="🏠" text="Dashboard" href="/" />
        <SidebarLink icon="🔗" text="LinkedIn Accounts" href="/linkedin-accounts" />
        <SidebarLink icon="📅" text="Calendar" href="/calendar" />
        <SidebarLink icon="✉️" text="Inbox" href="/inbox" />
      </nav>
      <div className="mt-auto pt-6 border-t border-[#1a3058]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-300 rounded-full w-10 h-10" />
          <div>
            <div className="text-white font-semibold text-lg">
              {user ? `${user.first_name || user.username} ${user.last_name || ""}` : "Kullanıcı"}
            </div>
            <div className="text-[#c0d0e0] text-xs mt-1">{user?.email}</div>
            <div className="text-[#ffe066] text-xs font-bold mt-1">
              {user?.role === "admin" ? "Admin" : user?.role === "sales" ? "Sales Person" : ""}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ icon, text, href = "#", active = false }: { icon: string; text: string; href?: string; active?: boolean }) {
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

function StatCard({ title, value, desc, dot }: any) {
  return (
    <div className="bg-white rounded-2xl shadow px-7 py-6 flex flex-col justify-between min-h-[120px]">
      <div className="flex items-center gap-2">
        <span className={`inline-block w-3 h-3 rounded-full ${dot}`} />
        <span className="text-base font-semibold text-[#00205C]">{title}</span>
      </div>
      <div className="text-3xl font-extrabold mt-2 mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{desc}</div>
    </div>
  );
}
