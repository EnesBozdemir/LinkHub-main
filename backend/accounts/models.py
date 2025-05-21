from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('sales', 'Sales Person'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='sales')

    linkedin_token = models.TextField(blank=True, null=True)  # ✅ LinkedIn oturum çerezi

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
