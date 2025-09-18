from fastapi import Request, HTTPException
import json
from parser import NutritionParser

PARSER_JSON_PATH = "parser.json"

async def parse_input_route(request: Request):
    try:
        data = await request.json()
        user_input = data.get("input")
        if not user_input:
            raise HTTPException(status_code=400, detail="No input provided")
        parser = NutritionParser('food_selected.csv')
        log_data = parser.parse_input(user_input)
        with open(PARSER_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(log_data, f, indent=2)
        return {"message": "Parsing complete", "parser_file": PARSER_JSON_PATH, "log": log_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))