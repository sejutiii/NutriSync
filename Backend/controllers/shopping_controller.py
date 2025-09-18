from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
from typing import List

router = APIRouter()

class ShoppingListRequest(BaseModel):
    budget: float

class ShoppingItem(BaseModel):
    name: str
    nutrient: str
    price: float

@router.post("/generate-shopping-list")
async def generate_shopping_list(body: ShoppingListRequest):
    try:
        # Use default file paths
        food_dataset_path = "nutrient_with_prices.csv"
        # Get deficient nutrients from nutrition_analysis.json
        import json
        with open("nutrition_analysis.json", "r", encoding="utf-8") as f:
            analysis = json.load(f)
        lacking_nutrients = [nutrient for nutrient, status in analysis.items() if status == -1]
        df = pd.read_csv(food_dataset_path)
        filtered = df[df['Nutrient'].isin(lacking_nutrients)]
        filtered = filtered.sort_values('Price')
        shopping_list = []
        total = 0.0
        for _, row in filtered.iterrows():
            if total + row['Price'] <= body.budget:
                shopping_list.append({
                    'name': row['Name'],
                    'nutrient': row['Nutrient'],
                    'price': row['Price']
                })
                total += row['Price']
        return {'shopping_list': shopping_list, 'total_spent': total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
