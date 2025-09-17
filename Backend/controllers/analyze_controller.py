import pandas as pd
import json
from fastapi import HTTPException, Request, Depends
from db import db
from bson import ObjectId
from controllers.user_controller import get_current_user
import csv

FOOD_CSV_PATH = "food.csv"
LOG_JSON_PATH = "logs-example.json"
OUTPUT_JSON_PATH = "output.json"

async def analyze_log():
    try:
        # Get current user info
        # FastAPI dependency injection: request is passed automatically
        async def get_user_info(request: Request):
            user = await get_current_user(request)
            return user

        # This is a workaround for FastAPI dependency injection in async controller
        # In actual FastAPI, use: current_user: dict = Depends(get_current_user)
        # Here, we simulate request extraction
        import inspect
        frame = inspect.currentframe()
        request = None
        while frame:
            if 'request' in frame.f_locals:
                request = frame.f_locals['request']
                break
            frame = frame.f_back
        if not request:
            raise HTTPException(status_code=400, detail="Request object not found")
        current_user = await get_current_user(request)
        age = current_user.get('age')
        gender = current_user.get('gender')

        # Load food.csv into DataFrame
        df = pd.read_csv(FOOD_CSV_PATH)
        # Load logs-example.json
        with open(LOG_JSON_PATH, "r", encoding="utf-8") as f:
            logs = json.load(f)

        # Find matching rows in food.csv
        results = []
        for key, entry in logs.items():
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

        # Sum totals for each column
        total_nutrition = {}
        for col in df.columns[3:]:
            total_nutrition[col] = sum(item[col] for item in results)

        # Write output.json
        with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(total_nutrition, f, indent=2)

        # --- Begin final.py logic integration ---
        # Load baseline data from CSV
        baseline_data = {}
        AGE_GROUP = str(age)
        GENDER = gender
        with open("baseline.csv", "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['Gender'] == GENDER and row['Age'] == AGE_GROUP:
                    nutrient = row['Nutrient']
                    baseline_data[nutrient] = {
                        'Baseline': float(row['Baseline']) if row['Baseline'] else None,
                        'UL': float(row['UL']) if row['UL'] else None
                    }

        # Mapping between JSON keys and baseline nutrient names
        nutrient_mapping = {
            'Data.Carbohydrate': 'Carbohydrates',
            'Data.Cholesterol': 'Cholesterol',
            'Data.Choline': 'Choline',
            'Data.Fiber': 'Fiber',
            'Data.Manganese': 'Manganese',
            'Data.Vitamin B3': 'Vitamin B3',
            'Data.Vitamin B5': 'Vitamin B5',
            'Data.Protein': 'Protein',
            'Data.Vitamin B2': 'Vitamin B2',
            'Data.Selenium': 'Selenium',
            'Data.Sugar Total': 'Sugar',
            'Data.Vitamin B1': 'Vitamin B1',
            'Data.Fat.Total Lipid': 'Fats',
            'Data.Major Minerals.Calcium': 'Calcium',
            'Data.Major Minerals.Copper': 'Copper',
            'Data.Major Minerals.Iron': 'Iron',
            'Data.Major Minerals.Magnesium': 'Magnesium',
            'Data.Major Minerals.Phosphorus': 'Phosphorus',
            'Data.Major Minerals.Potassium': 'Potassium',
            'Data.Major Minerals.Sodium': 'Sodium',
            'Data.Major Minerals.Zinc': 'Zinc',
            'Data.Vitamin A ': 'Vitamin A',
            'Data.Vitamins.Vitamin B12': 'Vitamin B12',
            'Data.Vitamins.Vitamin B6': 'Vitamin B6',
            'Data.Vitamins.Vitamin C': 'Vitamin C',
            'Data.Vitamins.Vitamin E': 'Vitamin E',
            'Data.Vitamins.Vitamin K': 'Vitamin K'
        }

        # Analyze each nutrient
        results_analysis = {}
        for json_key, nutrient_name in nutrient_mapping.items():
            if nutrient_name not in baseline_data:
                continue
            current_value = total_nutrition.get(json_key, 0)
            baseline = baseline_data[nutrient_name]['Baseline']
            ul = baseline_data[nutrient_name]['UL']
            if baseline is not None and current_value < baseline:
                status = -1  # Deficiency
            elif ul is not None and current_value > ul:
                status = 1   # Over the limit
            else:
                status = 0   # Normal
            results_analysis[nutrient_name] = status

        # Save results to nutrition_analysis.json
        with open('nutrition_analysis.json', 'w', encoding='utf-8') as f:
            json.dump(results_analysis, f, indent=2)

        # Return nutrition_analysis.json for frontend
        return {"message": "Analysis complete", "nutrition_analysis": results_analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))