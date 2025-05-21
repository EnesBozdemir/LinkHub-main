"use client";
import { useEffect, useState } from "react";

// Tipler
interface LinkedInMessage {
  id: number;
  sender: string;
  text: string;
  conversation_id: string;
  sent_at: string;
}

interface LinkedInReply {
  id: number;
  message: string;
  conversation_id: string;
  created_at: string;
}

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem("access_token");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export default function InboxPage() {
  const [messages, setMessages] = useState<LinkedInMessage[]>([]);
  const [replies, setReplies] = useState<LinkedInReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetchWithAuth("http://localhost:8000/linkedin/messages/"),
      fetchWithAuth("http://localhost:8000/linkedin/my-replies/"),
    ])
      .then(async ([msgRes, replyRes]) => {
        const [msgData, replyData] = await Promise.all([msgRes.json(), replyRes.json()]);
        setMessages(msgData);
        setReplies(replyData);
      })
      .catch(() => window.location.href = "/login")
      .finally(() => setLoading(false));
  }, []);

  const handleReply = async (conversation_id: string) => {
    const text = replyInputs[conversation_id];
    if (!text) return;

    const res = await fetchWithAuth("http://localhost:8000/linkedin/reply/", {
      method: "POST",
      body: JSON.stringify({ conversation_id, message: text }),
    });

    if (res.ok) {
      setReplyInputs((prev) => ({ ...prev, [conversation_id]: "" }));
      setReplies((prev) => [
        {
          id: Date.now(),
          message: text,
          conversation_id,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] px-8 py-10">
      <h1 className="text-2xl font-bold text-[#00205C] mb-8">LinkedIn Mesajlaşma Paneli</h1>
      {loading ? (
        <p className="text-gray-500">Yükleniyor...</p>
      ) : (
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-5 rounded-xl shadow flex flex-col gap-2"
            >
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-semibold">{msg.sender}</span>
                <span>{new Date(msg.sent_at).toLocaleString()}</span>
              </div>
              <div className="text-gray-800">{msg.text}</div>
              <div className="text-xs text-gray-400">Conversation: {msg.conversation_id}</div>

              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Cevap yaz..."
                  value={replyInputs[msg.conversation_id] || ""}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({
                      ...prev,
                      [msg.conversation_id]: e.target.value,
                    }))
                  }
                  className="flex-1 border border-gray-300 p-2 rounded-lg"
                />
                <button
                  onClick={() => handleReply(msg.conversation_id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Gönder
                </button>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Cevaplar:
                <ul className="list-disc ml-4 mt-1">
                  {replies
                    .filter((r) => r.conversation_id === msg.conversation_id)
                    .map((r) => (
                      <li key={r.id}>{r.message} ({new Date(r.created_at).toLocaleString()})</li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}