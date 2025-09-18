from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import csv
import json

router = APIRouter()

class ShoppingListRequest(BaseModel):
    budget: float

@router.post("/generate-shopping-list")
async def generate_shopping_list(body: ShoppingListRequest):
    try:
        # Load nutrient deficiencies
        with open("nutrition_analysis.json", "r", encoding="utf-8") as f:
            analysis = json.load(f)
        deficient_nutrients = [nutrient for nutrient, status in analysis.items() if status == -1]

        # Load nutrient_with_prices.csv
        food_items = []
        with open("nutrient_with_prices.csv", "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            next(reader)  # skip header
            for row in reader:
                if len(row) < 4:
                    continue
                food_id = row[0]
                food_name = row[1]
                nutrients = [n.strip() for n in row[2:-1]]
                price = int(row[-1])
                food_items.append({
                    "id": food_id,
                    "name": food_name,
                    "nutrients": nutrients,
                    "price": price
                })

        # Select foods for deficient nutrients within budget
        selected = []
        budget_left = body.budget
        for nutrient in deficient_nutrients:
            candidates = [item for item in food_items if nutrient in item["nutrients"] and item["price"] <= budget_left]
            if candidates:
                best = min(candidates, key=lambda x: x["price"])
                if best["name"] not in [f["name"] for f in selected]:
                    selected.append(best)
                    budget_left -= best["price"]

        total_cost = sum(item['price'] for item in selected)
        shopping_list = [
            {
                "name": item["name"],
                "price": item["price"],
                "nutrients": item["nutrients"]
            }
            for item in selected
        ]
        return {
            "shopping_list": shopping_list,
            "total_cost": total_cost,
            "budget": body.budget
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
