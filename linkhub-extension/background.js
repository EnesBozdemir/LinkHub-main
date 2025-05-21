console.log("🟢 background.js yüklendi!");

// 1. Extension içinden gelen mesajlar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📩 Dahili mesaj alındı:", message);
  if (message.type === "SAVE_TOKEN") {
    chrome.storage.local.set({ jwtToken: message.token }, () => {
      console.log("🔐 JWT kaydedildi (internal):", message.token);
      sendResponse({ status: "OK (internal)" });
    });
    return true; // async sendResponse
  }
});

// 2. Harici sayfalardan gelen mesajlar (örn. http://localhost:3000)
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log("🌐 Harici mesaj alındı:", message);
  if (message.type === "SAVE_TOKEN") {
    chrome.storage.local.set({ jwtToken: message.token }, () => {
      console.log("🔐 JWT kaydedildi (external):", message.token);
      sendResponse({ status: "OK (external)" });
    });
    return true;
  } else {
    console.warn("❗ Bilinmeyen mesaj tipi:", message.type);
    sendResponse({ status: "Unknown message type" });
    return false;
  }
});

// 3. Uzantı ikonuna tıklanırsa (li_at gönderme)
chrome.action.onClicked.addListener((tab) => {
  console.log("🖱️ Uzantı ikonu tıklandı.");

  chrome.storage.local.get("jwtToken", (result) => {
    const jwtToken = result.jwtToken;

    if (!jwtToken) {
      console.error("❌ JWT token yok. Giriş yapılmamış.");
      return;
    }

    // LinkedIn li_at çerezi al
    chrome.cookies.get({
      url: "https://www.linkedin.com",
      name: "li_at"
    }, function (cookie) {
      if (cookie && cookie.value) {
        const li_at = cookie.value;
        console.log("🍪 li_at bulundu:", li_at);

        // Backend'e POST isteği gönder
        fetch("http://localhost:8000/api/linkedin/save-linkedin-messages/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            li_at_cookie: li_at,
            messages: [], // burası gerektiği gibi doldurulabilir
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ API cevabı:", data);
          })
          .catch((err) => {
            console.error("⛔ API hatası:", err);
          });

      } else {
        console.error("❌ li_at çerezi alınamadı.");
      }
    });
  });
});
