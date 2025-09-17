import pandas as pd
import json

FOOD_CSV_PATH = "food.csv"
LOG_JSON_PATH = "logs-example.json"
OUTPUT_JSON_PATH = "output.json"

def test_analyze_log():
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
                print(f"Food item with key {key} not found in CSV.")
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

        print("Analysis complete. Output written to output.json.")
        print(json.dumps(total_nutrition, indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_analyze_log()
