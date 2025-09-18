from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
from typing import List

router = APIRouter()

class ShoppingListRequest(BaseModel):
    lacking_nutrients: List[str]
    food_dataset_path: str  # Path to main food CSV file
    price_dataset_path: str  # Path to nutrient_with_prices.csv
    weekly_budget: float

class ShoppingItem(BaseModel):
    name: str
    nutrient: str
    price: float

@router.post("/generate-shopping-list")
async def generate_shopping_list(body: ShoppingListRequest):
    try:
        # Read main food dataset
        df_food = pd.read_csv(body.food_dataset_path)
        # Read nutrient prices dataset
        df_price = pd.read_csv(body.price_dataset_path)
        # Merge price info into food dataset on Nutrient
        df_merged = pd.merge(df_food, df_price, on='Nutrient', how='left')
        # Filter foods by lacking nutrients
        filtered = df_merged[df_merged['Nutrient'].isin(body.lacking_nutrients)]
        # Sort by price ascending
        filtered = filtered.sort_values('Price')
        shopping_list = []
        total = 0.0
        for _, row in filtered.iterrows():
            if total + row['Price'] <= body.weekly_budget:
                shopping_list.append({
                    'name': row['Name'],
                    'nutrient': row['Nutrient'],
                    'price': row['Price']
                })
                total += row['Price']
        return {'shopping_list': shopping_list, 'total_spent': total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
