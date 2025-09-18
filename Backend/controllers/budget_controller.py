from fastapi import HTTPException
import csv
import json

ALL_NUTRIENTS = [
    'Calcium', 'Carbohydrates', 'Cholesterol', 'Choline', 'Copper', 'Fats',
    'Fiber', 'Iron', 'Magnesium', 'Manganese', 'Phosphorus', 'Potassium',
    'Protein', 'Selenium', 'Sodium', 'Sugar', 'Vitamin A', 'Vitamin B1',
    'Vitamin B12', 'Vitamin B2', 'Vitamin B3', 'Vitamin B5', 'Vitamin B6',
    'Vitamin C', 'Vitamin E', 'Vitamin K', 'Zinc'
]
PRIORITY_NUTRIENTS = ["Carbohydrates", "Protein"]

async def generate_shopping_list(budget: int):
    # Load nutrient deficiencies
    try:
        with open("nutrition_analysis.json", "r", encoding="utf-8") as f:
            analysis = json.load(f)
    except Exception:
        raise HTTPException(status_code=500, detail="nutrition_analysis.json not found or invalid")
    deficient_nutrients = [nutrient for nutrient, status in analysis.items() if status == -1]

    # Load nutrient_with_prices.csv
    food_items = []
    try:
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
    except Exception:
        raise HTTPException(status_code=500, detail="nutrient_with_prices.csv not found or invalid")

    selected = []
    covered_nutrients = set()
    budget_left = budget

    def select_foods(target_nutrients):
        nonlocal budget_left
        for nutrient in target_nutrients:
            if nutrient in covered_nutrients:
                continue
            candidates = [item for item in food_items if nutrient in item["nutrients"] and item["price"] <= budget_left]
            if candidates:
                best = min(candidates, key=lambda x: x["price"])
                if best["name"] not in [f["name"] for f in selected]:
                    selected.append(best)
                    budget_left -= best["price"]
                    covered_nutrients.update(best["nutrients"])

    # 1. Carbs and Protein
    select_foods(PRIORITY_NUTRIENTS)
    # 2. Deficient micronutrients
    select_foods(deficient_nutrients)
    # 3. All other nutrients within budget
    select_foods([n for n in ALL_NUTRIENTS if n not in covered_nutrients])

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
        "budget": budget
    }
