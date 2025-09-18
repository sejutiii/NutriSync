from fastapi import APIRouter
from controllers.user_controller import (
    create_user,
    get_user,
    get_user_by_email,
    get_all_users,
    delete_all_users,
    update_user_info,
)
from controllers.analyze_controller import analyze_log
from controllers.auth_controller import login_user

router = APIRouter()

router.post("/users")(create_user)
<<<<<<< HEAD
##router.get("/users/{user_id}")(get_user)
=======
router.get("/users/{email}")(get_user)
>>>>>>> 3c167f2886739f0bca23a196545579035ac96c89
router.get("/users")(get_all_users)
router.delete("/users")(delete_all_users)
router.post("/login")(login_user)
router.put("/users/update")(update_user_info)
router.post("/analyze/nutrients")(analyze_log)
router.get("/users/email/{email}")(get_user_by_email)