from django.utils import timezone
from django.conf import settings
from django.db import models

class LinkedInMessage(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    sender = models.CharField(max_length=255, default='unknown sender')
    text = models.TextField(default='no text')
    conversation_id = models.CharField(max_length=255, default='unknown')
    created_at = models.DateTimeField(default=timezone.now)
    sent_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.sender}: {self.text[:30]}..."

    class Meta:
        ordering = ['-sent_at']  # En son mesaj en üstte olsun


class LinkedInAccount(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    email = models.EmailField()
    li_at_cookie = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.email}"

    class Meta:
        unique_together = ('user', 'email')  # Aynı kullanıcı aynı e-postayı iki kez ekleyemez
        ordering = ['-created_at']  # En son eklenen hesap en üstte

# linkedin/models.py

class LinkedInReply(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    conversation_id = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.message[:30]}..."
    
    class Meta:
        ordering = ['-created_at']  # En son cevaplar en üstte
