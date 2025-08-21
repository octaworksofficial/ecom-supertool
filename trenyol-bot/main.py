import requests
from openai_assistant import OpenAIAssistant
from trendyol_answer_sender import TrendyolAnswerSender
import re
import os
from datetime import datetime, timedelta


API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key-here")
ASSISTANT_ID = os.getenv("OPENAI_ASSISTANT_ID", "asst_8upBTuspnk1s7hBStFChlGFr")
SELLER_ID = os.getenv("TRENDYOL_SELLER_ID", "913474")

# Dinamik tarih hesaplama
now = datetime.now()
end_date = int(now.timestamp() * 1000)
start_date = int((now - timedelta(days=5)).timestamp() * 1000)

url = f"https://apigw.trendyol.com/integration/qna/sellers/{SELLER_ID}/questions/filter"

headers = {
    "Content-Type": "application/json"
}

username = "ucm3MtoH9cMfPk5HLNJI"
password = "7XLzfa0QRZ2PgAixqFRo"

print("Program başlatılıyor...")

def temizle_referanslar(yanit):
    # PDF referanslarını ve köşeli parantez içindeki kaynakları temizler
    return re.sub(r"\[[^\]]*\]", "", yanit).strip()

if __name__ == "__main__":
    assistant = OpenAIAssistant(API_KEY, ASSISTANT_ID)
    answer_sender = TrendyolAnswerSender(username, password, SELLER_ID)

    try:
        response = requests.get(url, headers=headers, auth=(username, password))
        response.raise_for_status()
        data = response.json()
        print("API Yanıtı:", data)  # Yanıtı görmek için ekleyin

        content = data.get("content")
        if not content:
            print("Bekleyen soru bulunamadı veya API yanıtı hatalı.")
        else:
            for question in content:
                print(f"Müşteri Sorusu: {question.get('text')}")
                print(f"Ürün adı: {question.get('productName')}\n")
                prompt = f"Ürün Adı: {question.get('productName')}\nMüşteri Sorusu: {question.get('text')}"
                yanit = assistant.ask(prompt)
                yanit = temizle_referanslar(yanit)
                print("Yapay Zeka Yanıtı:", yanit)

                # Kullanıcı onayı al
                onay = input("Yanıtı göndermek için 1, göndermemek için 0 yazın: ")
                if onay.strip() == "1":
                    question_id = question.get("id")
                    post_response = answer_sender.send_answer(question_id, yanit)
                    print("Yanıt gönderildi, Trendyol API response:", post_response.status_code, post_response.text)
                else:
                    print("Yanıt gönderilmedi.")
    except Exception as e:
        print("Bir hata oluştu:", e)

