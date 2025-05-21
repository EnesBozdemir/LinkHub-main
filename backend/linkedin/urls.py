from django.urls import path
from .views import (
    SaveLinkedInMessagesView,
    MyLinkedInAccountsView,
    LinkedInMessageListView,
    LinkedInReplyView,
    LinkedInReplyListView,
    LinkedInScrapeMessagesView,
    StoreLinkedInTokenView, 
)

urlpatterns = [
    path('save-linkedin-messages/', SaveLinkedInMessagesView.as_view(), name="save_linkedin_messages"),
    path('my-accounts/', MyLinkedInAccountsView.as_view(), name="my_linkedin_accounts"),
    path('messages/', LinkedInMessageListView.as_view(), name="linkedin_messages"),
    path("reply/", LinkedInReplyView.as_view(), name="linkedin-reply"),
    path("my-replies/", LinkedInReplyListView.as_view(), name="linkedin-replies"),
    path("scrape/", LinkedInScrapeMessagesView.as_view(), name="linkedin-scrape"),
    path("store-linkedin-token/", StoreLinkedInTokenView.as_view(), name="store_linkedin_token"),  # ✅ Yeni eklendi
]
