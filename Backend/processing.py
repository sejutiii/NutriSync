import csv
from db import db
from models.food import Food

async def import_food_csv(csv_path: str):
	with open(csv_path, newline='', encoding='utf-8') as csvfile:
		reader = csv.DictReader(csvfile)
		foods = []
		for row in reader:
			# Convert numeric fields to float if possible
			for k, v in row.items():
				if v and k != "Nutrient Data Bank Number":
					try:
						row[k] = float(v)
					except ValueError:
						pass
			food = Food(**row)
			foods.append(food.dict(by_alias=True))
		if foods:
			await db["food"].insert_many(foods)
			print(f"Inserted {len(foods)} food items into MongoDB.")
		else:
			print("No food items found in CSV.")