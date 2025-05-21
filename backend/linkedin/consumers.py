import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("messages", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("messages", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "")

        # Mesajı tüm dinleyicilere broadcast et
        await self.channel_layer.group_send(
            "messages",
            {
                "type": "chat_message",
                "message": message,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"]
        }))
