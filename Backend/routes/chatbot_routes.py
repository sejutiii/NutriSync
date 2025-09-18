from fastapi import APIRouter
from controllers.chatbot_controller import chatbot_endpoint, list_gemini_models

router = APIRouter()

router.post("/chatbot")(chatbot_endpoint)
router.get("/chatbot/models")(list_gemini_models)
