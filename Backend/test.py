import csv
import json

BUDGET = 500
PRIORITY_NUTRIENTS = ["Carbohydrates", "Protein"]
ALL_NUTRIENTS = [
    'Calcium', 'Carbohydrates', 'Cholesterol', 'Choline', 'Copper', 'Fats',
    'Fiber', 'Iron', 'Magnesium', 'Manganese', 'Phosphorus', 'Potassium',
    'Protein', 'Selenium', 'Sodium', 'Sugar', 'Vitamin A', 'Vitamin B1',
    'Vitamin B12', 'Vitamin B2', 'Vitamin B3', 'Vitamin B5', 'Vitamin B6',
    'Vitamin C', 'Vitamin E', 'Vitamin K', 'Zinc'
]

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
        # row: Id, Food_Item, Nutrient(s), Price
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

# Helper: select foods for a set of nutrients
selected = []
covered_nutrients = set()
budget_left = BUDGET

def select_foods(target_nutrients):
    global budget_left
    for nutrient in target_nutrients:
        if nutrient in covered_nutrients:
            continue
        # Find cheapest food that provides this nutrient
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

# Print shopping list
print("Shopping List (within budget):")
total_cost = 0
for item in selected:
    print(f"{item['name']} (Price: {item['price']}, Nutrients: {', '.join(item['nutrients'])})")
    total_cost += item['price']
print(f"Total cost: {total_cost} / {BUDGET} taka")
