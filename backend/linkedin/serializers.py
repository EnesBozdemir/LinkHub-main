from rest_framework import serializers
from .models import LinkedInAccount, LinkedInMessage, LinkedInReply

class LinkedInAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkedInAccount
        fields = '__all__'
        read_only_fields = ('user', 'id', 'created_at')  # varsa created_at, yoksa bu satırı çıkar

class LinkedInMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkedInMessage
        fields = '__all__'

class LinkedInReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkedInReply
        fields = "__all__"