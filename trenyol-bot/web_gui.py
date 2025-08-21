
from flask import Flask, render_template, request, jsonify
from openai_assistant import OpenAIAssistant
from trendyol_answer_sender import TrendyolAnswerSender
import requests
import re
import os
from datetime import datetime, timedelta


app = Flask(__name__)


API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key-here")
ASSISTANT_ID = os.getenv("OPENAI_ASSISTANT_ID", "asst_8upBTuspnk1s7hBStFChlGFr")
SELLER_ID = os.getenv("TRENDYOL_SELLER_ID", "913474")
username = os.getenv("TRENDYOL_USERNAME", "your-username-here")
password = os.getenv("TRENDYOL_PASSWORD", "your-password-here")

assistant = OpenAIAssistant(API_KEY, ASSISTANT_ID)
answer_sender = TrendyolAnswerSender(username, password, SELLER_ID)

def temizle_referanslar(yanit):
    return re.sub(r"\[[^\]]*\]", "", yanit).strip()


def get_questions():
    # Trendyol
    now = datetime.now()
    end_date = int(now.timestamp() * 1000)
    start_date = int((now - timedelta(days=5)).timestamp() * 1000)
    url = f"https://apigw.trendyol.com/integration/qna/sellers/{SELLER_ID}/questions/filter?startDate={start_date}&endDate={end_date}&status=WAITING_FOR_ANSWER&size=10"
    headers = {"Content-Type": "application/json"}
    questions = []
    try:
        response = requests.get(url, headers=headers, auth=(username, password))
        response.raise_for_status()
        data = response.json()
        trendyol_questions = data.get("content", [])
        for q in trendyol_questions:
            q["marketplace"] = "trendyol"
        questions.extend(trendyol_questions)
    except Exception as e:
        return f"Trendyol Soru API Hatası: {e}"

    return questions

@app.route('/')
def index():
    questions = get_questions()
    error_message = None
    if isinstance(questions, str):
        error_message = questions
        questions = []
    return render_template('index.html', questions=questions, error_message=error_message)

@app.route('/get_ai_response', methods=['POST'])
def get_ai_response():
    data = request.json
    prompt = f"Ürün Adı: {data['productName']}\nMüşteri Sorusu: {data['question']}"
    try:
        yanit = assistant.ask(prompt)
        yanit = temizle_referanslar(yanit)
        return jsonify({'response': yanit})
    except Exception as e:
        return jsonify({'response': f"OpenAI API Hatası: {e}"})

@app.route('/ask_custom_question', methods=['POST'])
def ask_custom_question():
    data = request.json
    custom_question = data.get('question', '')
    try:
        yanit = assistant.ask(custom_question)
        yanit = temizle_referanslar(yanit)
        return jsonify({'response': yanit})
    except Exception as e:
        return jsonify({'response': f"OpenAI API Hatası: {e}"})

@app.route('/send_answer', methods=['POST'])
def send_answer():
    data = request.json
    try:
        response = answer_sender.send_answer(data['questionId'], data['answer'])
        return jsonify({
            'status': response.status_code,
            'text': response.text
        })
    except Exception as e:
        return jsonify({
            'status': 500,
            'text': f"Yanıt API Hatası: {e}"
        })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
