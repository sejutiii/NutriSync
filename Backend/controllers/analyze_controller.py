import pandas as pd
import json
from fastapi import HTTPException

FOOD_CSV_PATH = "food.csv"
LOG_JSON_PATH = "logs-example.json"
OUTPUT_JSON_PATH = "output.json"

async def analyze_log():
    try:
        # Load food.csv into DataFrame
        df = pd.read_csv(FOOD_CSV_PATH)
        # Load logs-example.json
        with open(LOG_JSON_PATH, "r", encoding="utf-8") as f:
            logs = json.load(f)

        # Find matching rows in food.csv
        results = []
        for key, entry in logs.items():
            # Find row where Nutrient Data Bank Number == key
            row = df[df[df.columns[2]] == int(key)]
            if row.empty:
                continue
            row = row.iloc[0]
            amount_gm = entry["amount_gm"]
            # Calculate nutrition values for all columns from col 3 onwards
            nutrition = {}
            for col in df.columns[3:]:
                # All values are per 100g, so scale by amount_gm/100
                try:
                    value = float(row[col]) * (amount_gm / 100)
                except (ValueError, TypeError):
                    value = 0
                nutrition[col] = value
            results.append(nutrition)

        # Sum totals for each column
        total_nutrition = {}
        for col in df.columns[3:]:
            total_nutrition[col] = sum(item[col] for item in results)

        # Write output.json
        with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(total_nutrition, f, indent=2)

        return {"message": "Analysis complete", "output_file": OUTPUT_JSON_PATH}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))