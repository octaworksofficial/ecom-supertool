import requests

class TrendyolAnswerSender:
    def __init__(self, username, password, seller_id):
        self.username = username
        self.password = password
        self.seller_id = seller_id

    def send_answer(self, question_id, answer):
        url = f"https://apigw.trendyol.com/integration/qna/sellers/{self.seller_id}/questions/{question_id}/answers"
        headers = {
            "Content-Type": "application/json"
        }
        data = {
            "text": answer
        }
        response = requests.post(url, headers=headers, json=data, auth=(self.username, self.password))
        return response