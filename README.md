# LinkHub

**LinkHub**, çoklu LinkedIn hesaplarını tek bir panelden yönetmek ve tüm mesajlaşma süreçlerini merkezi olarak kontrol etmek için geliştirilen modern ve ölçeklenebilir bir platformdur.

---

## 🚀 Özellikler

- Birden fazla LinkedIn hesabı bağlama ve yönetme
- Tüm mesaj kutularını (inbox, gönderilen vs.) merkezi olarak görme
- Platform üzerinden mesaj gönderme ve yanıtlama
- LinkedIn profili, bağlantı listesi ve diğer hesap bilgilerini görüntüleme
- Gelişmiş kullanıcı ve yetki/rol yönetimi (admin, user vs.)
- Güvenli oturum ve veri yönetimi
- Modern, responsive ve kullanıcı dostu arayüz
- (Gelecek sürümlerde) Diğer sosyal medya platformlarıyla entegrasyon

## ⚙️ Teknoloji Stack’i

- **Backend:** Python, Django REST Framework, Playwright/Selenium (scraping için)
- **Frontend:** React.js (Next.js), Tailwind CSS
- **Veritabanı:** PostgreSQL
- **Gerçek Zamanlılık:** Django Channels/WebSocket (opsiyonel)
- **Deployment:** Vercel (frontend), AWS/DigitalOcean/Heroku (backend)

---

## 🛠️ Kurulum & Çalıştırma

### 1. Backend (Django)

```bash
git clone https://github.com/kullaniciadi/linkhub.git
cd backend
python -m venv venv
source venv/bin/activate  # Windows için: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

