# backend/app/config.py
import os
from google import genai

# Lấy API key từ biến môi trường GEMINI_API_KEY
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY chưa được set trong biến môi trường. "
        "Hãy set rồi chạy lại server."
    )

# Tạo client Gemini
client = genai.Client(api_key=GEMINI_API_KEY)