# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import router as api_router

app = FastAPI(
    title="Gemini Backend for React Native",
    description="Backend đơn giản nhận prompt từ app và gọi Gemini 2.5 Flash.",
    version="0.1.0",
)

# CORS – cho phép gọi từ mọi origin (RN, web, v.v.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # sau này có thể siết lại
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký router
app.include_router(api_router)
