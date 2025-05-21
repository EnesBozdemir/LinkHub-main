from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import LinkedInMessage, LinkedInAccount, LinkedInReply
from .serializers import (
    LinkedInMessageSerializer,
    LinkedInAccountSerializer,
    LinkedInReplySerializer,
)
from rest_framework.generics import ListAPIView
from .scraper import get_linkedin_messages

class MyLinkedInAccountsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accounts = LinkedInAccount.objects.filter(user=request.user)
        serializer = LinkedInAccountSerializer(accounts, many=True)
        return Response(serializer.data)


class SaveLinkedInMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        li_at_cookie = request.data.get("li_at_cookie")
        messages = request.data.get("messages", [])

        if not li_at_cookie and not messages:
            return Response(
                {"error": "li_at_cookie veya messages alanı boş."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response_data = {}

        # LinkedIn hesabını kaydet veya getir
        if li_at_cookie:
            account, created = LinkedInAccount.objects.get_or_create(
                user=request.user,
                defaults={"li_at_cookie": li_at_cookie}
            )
            if not created:
                account.li_at_cookie = li_at_cookie
                account.save()

            account_serializer = LinkedInAccountSerializer(account)
            response_data["account"] = account_serializer.data
            response_data["account_status"] = "Yeni hesap oluşturuldu." if created else "Mevcut hesap güncellendi."

        # Mesajları kaydet
        if messages:
            created_messages = []
            invalid_messages = []

            for msg in messages:
                serializer = LinkedInMessageSerializer(data=msg)
                if serializer.is_valid():
                    serializer.save(user=request.user)
                    created_messages.append(serializer.data)
                else:
                    invalid_messages.append(serializer.errors)

            response_data["messages"] = created_messages
            if invalid_messages:
                response_data["invalid_messages"] = invalid_messages
            response_data["messages_status"] = f"{len(created_messages)} mesaj kaydedildi."

        return Response(response_data, status=status.HTTP_201_CREATED)


class LinkedInMessageListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LinkedInMessageSerializer

    def get_queryset(self):
        return LinkedInMessage.objects.filter(user=self.request.user).order_by("-sent_at")


class LinkedInReplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        conversation_id = request.data.get("conversation_id")
        message = request.data.get("message")

        if not conversation_id or not message:
            return Response(
                {"error": "conversation_id ve message alanları zorunludur."},
                status=status.HTTP_400_BAD_REQUEST
            )

        reply_data = {
            "user": request.user.id,
            "conversation_id": conversation_id,
            "message": message,
        }

        serializer = LinkedInReplySerializer(data=reply_data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "Cevap başarıyla kaydedildi."}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LinkedInReplyListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LinkedInReplySerializer

    def get_queryset(self):
        return LinkedInReply.objects.filter(user=self.request.user).order_by("-created_at")


class LinkedInScrapeMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        account = LinkedInAccount.objects.filter(user=request.user).first()
        if not account:
            return Response({"error": "LinkedIn hesabı bulunamadı."}, status=404)

        try:
            scraped = get_linkedin_messages(account.li_at_cookie)
            return Response(scraped)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class StoreLinkedInTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get("linkedin_token")
        if not token:
            return Response({"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST)

        account, created = LinkedInAccount.objects.get_or_create(
            user=request.user,
            defaults={"li_at_cookie": token}
        )
        if not created:
            account.li_at_cookie = token
            account.save()

        return Response({"message": "Token saved successfully"}, status=status.HTTP_201_CREATED)