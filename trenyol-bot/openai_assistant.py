import openai
import time

class OpenAIAssistant:
    def __init__(self, api_key, assistant_id):
        self.api_key = api_key
        self.assistant_id = assistant_id
        self.client = openai.Client(api_key=self.api_key)

    def ask(self, prompt):
        try:
            # Thread oluştur
            thread = self.client.beta.threads.create()

            # Mesajı gönder
            self.client.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content=prompt
            )

            # Assistant'ı çalıştır
            run = self.client.beta.threads.runs.create(
                thread_id=thread.id,
                assistant_id=self.assistant_id
            )

            # Yanıtı bekle
            while True:
                run_status = self.client.beta.threads.runs.retrieve(
                    thread_id=thread.id,
                    run_id=run.id
                )
                if run_status.status == 'completed':
                    break
                elif run_status.status == 'failed':
                    raise Exception("Assistant yanıt vermedi")
                time.sleep(1)

            # Yanıtı al
            messages = self.client.beta.threads.messages.list(thread_id=thread.id)
            
            # En son assistant mesajını bul
            for message in messages.data:
                if message.role == "assistant":
                    return message.content[0].text.value

            return "Yanıt alınamadı"

        except Exception as e:
            return f"Hata oluştu: {str(e)}"