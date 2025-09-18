from fastapi import APIRouter, Request, HTTPException
from controllers.budget_controller import generate_shopping_list

router = APIRouter()

@router.post("/generate-shopping-list")
async def shopping_list_route(request: Request):
    try:
        data = await request.json()
        budget = data.get("budget")
        if budget is None:
            raise HTTPException(status_code=400, detail="Budget is required")
        result = await generate_shopping_list(int(budget))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
