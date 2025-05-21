from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Tüm API'leri tek kökten çağırmak daha düzenlidir
    path('api/linkedin/', include('linkedin.urls')),     # ✅ Chrome extension buraya istek atacak
    path('api/accounts/', include('accounts.urls')),     # Kullanıcı işlemleri (login/register) buradaysa
]
