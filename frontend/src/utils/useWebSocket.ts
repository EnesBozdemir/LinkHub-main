import { useEffect } from "react";

export function useWebSocket(onMessage: (msg: string) => void) {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/messages/");

    socket.onopen = () => {
      console.log("WebSocket bağlantısı açıldı.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data.message);
    };

    socket.onclose = () => {
      console.log("WebSocket bağlantısı kapatıldı.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket hatası:", error);
    };

    return () => {
      socket.close();
    };
  }, [onMessage]);
}
