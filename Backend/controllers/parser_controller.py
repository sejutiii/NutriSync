from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
import json
from parser import NutritionParser

router = APIRouter()

class ParseRequest(BaseModel):
    input: str

class ParseResponse(BaseModel):
    output: dict

@router.post("/parse-input", response_model=ParseResponse)
async def parse_input_route(body: ParseRequest):
    try:
        user_input = body.input
        if not user_input:
            raise HTTPException(status_code=400, detail="No input provided")
        parser = NutritionParser('food_selected.csv')
        log_data = parser.parse_input(user_input)
        with open("parser.json", "w", encoding="utf-8") as f:
            json.dump(log_data, f, indent=2)
        # --- Create output.json from parser log ---
        import pandas as pd
        FOOD_CSV_PATH = "food.csv"
        OUTPUT_JSON_PATH = "output.json"
        try:
            df = pd.read_csv(FOOD_CSV_PATH)
            results = []
            for key, entry in log_data.items():
                row = df[df[df.columns[2]] == int(key)]
                if row.empty:
                    continue
                row = row.iloc[0]
                amount_gm = entry["amount_gm"]
                nutrition = {}
                for col in df.columns[3:]:
                    try:
                        value = float(row[col]) * (amount_gm / 100)
                    except (ValueError, TypeError):
                        value = 0
                    nutrition[col] = value
                results.append(nutrition)
            total_nutrition = {}
            for col in df.columns[3:]:
                total_nutrition[col] = sum(item[col] for item in results)
            with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
                json.dump(total_nutrition, f, indent=2)
        except Exception:
            pass
        # Return output.json content as response
        with open(OUTPUT_JSON_PATH, "r", encoding="utf-8") as f:
            output_data = json.load(f)
        return ParseResponse(output=output_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))