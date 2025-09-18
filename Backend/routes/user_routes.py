from fastapi import APIRouter
from controllers.user_controller import (
    create_user,
    get_user_by_email,
    get_all_users,
    delete_all_users,
    update_user_info,
)
from controllers.parser_controller import parse_input_route
from controllers.analyze_controller import analyze_log
from controllers.calories_controller import analyze_calories
from controllers.chatbot_controller import router as chatbot_router
from routes.shopping_routes import router as shopping_router
from controllers.auth_controller import login_user

router = APIRouter()

router.post("/users")(create_user)
router.get("/users/email/{email}")(get_user_by_email)
router.get("/users")(get_all_users)
router.delete("/users")(delete_all_users)
router.post("/login")(login_user)
router.put("/users/update")(update_user_info)
router.post("/analyze/nutrients/email/{email}")(analyze_log)
router.get("/analyze/calories/email/{email}")(analyze_calories)
router.get("/users/email/{email}")(get_user_by_email)
router.post("/parse-input")(parse_input_route)

# Gemini AI Chatbot endpoint
router.include_router(chatbot_router, prefix="")


# Shopping List Generator endpoint
router.include_router(shopping_router, prefix="")

# Budget-based Shopping List endpoint
from routes.budget_routes import router as budget_router
router.include_router(budget_router, prefix="")
