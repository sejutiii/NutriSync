import json
import csv

# Hardcoded user profile
GENDER = 'F'
AGE_GROUP = 'A'

# Load the nutrition data from output.json
with open('output.json', 'r') as f:
    nutrition_data = json.load(f)

# Load baseline data from CSV
baseline_data = {}
with open('baseline.csv', 'r') as f:
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
results = {}

for json_key, nutrient_name in nutrient_mapping.items():
    if nutrient_name not in baseline_data:
        continue
        
    current_value = nutrition_data[json_key]
    baseline = baseline_data[nutrient_name]['Baseline']
    ul = baseline_data[nutrient_name]['UL']
    
    # Determine status
    if baseline is not None and current_value < baseline:
        status = -1  # Deficiency
    elif ul is not None and current_value > ul:
        status = 1   # Over the limit
    else:
        status = 0   # Normal
        
    results[nutrient_name] = status

# Save results to a new JSON file
with open('nutrition_analysis.json', 'w') as f:
    json.dump(results, f, indent=2)

print("Analysis complete. Results saved to nutrition_analysis.json")