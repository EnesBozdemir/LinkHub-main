from django.contrib import admin
from .models import LinkedInMessage, LinkedInAccount


@admin.register(LinkedInMessage)
class LinkedInMessageAdmin(admin.ModelAdmin):
    list_display = ("user", "sender", "short_text", "sent_at", "conversation_id")
    search_fields = ("user__username", "sender", "text", "conversation_id")
    list_filter = ("sent_at", "created_at")
    ordering = ("-sent_at",)
    date_hierarchy = "sent_at"

    def short_text(self, obj):
        return (obj.text[:50] + "...") if len(obj.text) > 50 else obj.text
    short_text.short_description = "Mesaj"


@admin.register(LinkedInAccount)
class LinkedInAccountAdmin(admin.ModelAdmin):
    list_display = ("user", "email", "created_at")
    search_fields = ("email", "user__username")
    list_filter = ("created_at",)
    ordering = ("-created_at",)
