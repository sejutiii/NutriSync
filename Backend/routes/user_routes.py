from fastapi import APIRouter
from controllers.user_controller import (
    create_user,
    get_user_by_email,
    get_all_users,
    delete_all_users,
    update_user_info,
)
from controllers.parser_controller import parse_input_route, parse_json_route
from controllers.analyze_controller import analyze_log
from controllers.calories_controller import analyze_calories
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
router.post("/parse-input")(parse_input_route)
router.post("/parse-json")(parse_json_route)

# Remove or comment out the problematic line
# router.include_router(chatbot_router, prefix="")