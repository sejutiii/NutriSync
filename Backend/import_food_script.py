import asyncio
from processing import import_food_csv

if __name__ == "__main__":
    asyncio.run(import_food_csv("food.csv"))
