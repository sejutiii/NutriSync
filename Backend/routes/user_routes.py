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
from controllers.shopping_controller import router as shopping_router
## Removed shopping_routes import
from controllers.auth_controller import login_user, logout_user

router = APIRouter()

router.post("/users")(create_user)
router.get("/users/email/{email}")(get_user_by_email)
router.get("/users")(get_all_users)
router.delete("/users")(delete_all_users)
router.post("/login")(login_user)
router.post("/logout")(logout_user)
router.put("/users/update")(update_user_info)
router.post("/analyze/nutrients/email/{email}")(analyze_log)
router.get("/analyze/calories/email/{email}")(analyze_calories)
router.get("/users/email/{email}")(get_user_by_email)
router.post("/parse-input")(parse_input_route)


# Gemini AI Chatbot endpoint
router.include_router(chatbot_router, prefix="")

# Shopping List endpoint
router.include_router(shopping_router, prefix="")


## Removed shopping_router registration

## Removed budget_routes import and registration
