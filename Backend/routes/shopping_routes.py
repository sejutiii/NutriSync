from fastapi import APIRouter
from controllers.shopping_controller import generate_shopping_list

router = APIRouter()

router.post("/generate-shopping-list")(generate_shopping_list)
