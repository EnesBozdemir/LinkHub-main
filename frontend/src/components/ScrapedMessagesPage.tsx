"use client";

import { useEffect, useState } from "react";

type ScrapedMessage = {
  title: string;
  url: string;
};

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("access_token");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export default function ScrapedMessagesPage() {
  const [messages, setMessages] = useState<ScrapedMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/linkedin/scrape/")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => {
        console.error("Scrape hatası:", err);
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-10 bg-[#f0f4f8]">
      <h1 className="text-2xl font-bold text-[#00205C] mb-8">
        🔎 Çekilen LinkedIn Mesajları
      </h1>

      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : messages.length === 0 ? (
        <div className="text-gray-400">Henüz mesaj çekilmedi.</div>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-xl shadow hover:bg-gray-50 transition"
            >
              <a
                href={msg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold"
              >
                {msg.title || "Başlıksız Mesaj"}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
