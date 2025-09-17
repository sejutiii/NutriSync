from fastapi import APIRouter
from controllers.user_controller import create_user, get_user, get_all_users, delete_all_users, update_user_info
from controllers.auth_controller import login_user

router = APIRouter()

router.post("/users")(create_user)
router.get("/users/{user_id}")(get_user)
router.get("/users")(get_all_users)
router.delete("/users")(delete_all_users)
router.post("/login")(login_user)
router.put("/users/update")(update_user_info)