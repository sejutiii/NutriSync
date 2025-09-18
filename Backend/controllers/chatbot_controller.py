import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chatbot")
async def chatbot_endpoint(body: ChatRequest):
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(body.message)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper endpoint to list available Gemini models
@router.get("/chatbot/models")
async def list_gemini_models():
    try:
        models = genai.list_models()
        return {"models": [m.name for m in models]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
