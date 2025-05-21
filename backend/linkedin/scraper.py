# linkedin/scraper.py
from playwright.sync_api import sync_playwright

def get_linkedin_messages(li_at_cookie: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Cookie'yi ekle
        context.add_cookies([{
            'name': 'li_at',
            'value': li_at_cookie,
            'domain': '.www.linkedin.com',
            'path': '/',
            'httpOnly': True,
            'secure': True,
            'sameSite': 'Lax'
        }])

        page = context.new_page()
        page.goto("https://www.linkedin.com/messaging/")

        page.wait_for_selector(".msg-conversations-container")

        # Örnek: İlk birkaç mesaj başlığını topla
        messages = page.query_selector_all(".msg-conversation-listitem__link")

        result = []
        for msg in messages[:10]:
            try:
                title = msg.inner_text()
                href = msg.get_attribute("href")
                result.append({"title": title, "url": f"https://www.linkedin.com{href}"})
            except:
                continue

        browser.close()
        return result
