# backend/app/routes.py
from fastapi import APIRouter, HTTPException
from google.genai.errors import APIError

from .config import client
from .schemas import AskRequest, AskResponse

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/ask", response_model=AskResponse)
async def ask_gemini(body: AskRequest):
    """
    Nhận prompt từ React Native, gửi tới Gemini 2.5 Flash,
    rồi trả lại text cho app.
    """
    try:
        # Gọi Gemini API
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=body.prompt,
        )

        # Lấy text trả về
        answer_text = response.text or ""
        answer_text = answer_text.strip()

        return AskResponse(answer=answer_text)

    except APIError as e:
        # Lỗi từ phía Gemini API
        raise HTTPException(
            status_code=502, detail=f"Gemini API error: {e}"
        )
    except Exception as e:
        # Lỗi bất ngờ khác
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {e}"
        )
