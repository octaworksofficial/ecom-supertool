# Trendyol Bot

Bu Python bot'u Trendyol'dan gelen soruları otomatik olarak yanıtlamak için OpenAI assistant'ını kullanır.

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
pip install flask openai requests
```

2. Environment değişkenlerini ayarlayın:
```bash
cp .env.example .env
# .env dosyasını düzenleyerek API key'lerinizi ekleyin
```

3. Bot'u çalıştırın:
```bash
python main.py
```

## Kullanım

- `web_gui.py`: Flask web arayüzü
- `main.py`: Ana bot logic'i
- `openai_assistant.py`: OpenAI entegrasyonu
- `trendyol_answer_sender.py`: Trendyol API entegrasyonu

## Güvenlik

API key'leri asla kodda hardcode etmeyin. Environment değişkenlerini kullanın.
