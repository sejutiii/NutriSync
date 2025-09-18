import pandas as pd
import numpy as np

# Load your dataset
df = pd.read_csv('nutrient_recommendations.csv')

# 1. Normalize the dataset - group by food and combine nutrients
normalized_df = df.groupby(['Id', 'Food_Item'])['Nutrient'].apply(lambda x: ', '.join(x)).reset_index()

# Define the allowed nutrients list
allowed_nutrients = [
    'Calcium', 'Carbohydrates', 'Cholesterol', 'Choline', 'Copper', 'Fats',
    'Fiber', 'Iron', 'Magnesium', 'Manganese', 'Phosphorus', 'Potassium',
    'Protein', 'Selenium', 'Sodium', 'Sugar', 'Vitamin A', 'Vitamin B1',
    'Vitamin B12', 'Vitamin B2', 'Vitamin B3', 'Vitamin B5', 'Vitamin B6',
    'Vitamin C', 'Vitamin E', 'Vitamin K', 'Zinc'
]

# 2. Add missing nutrients based on common knowledge (only from allowed list)
additional_nutrients = {
    'MILK': ['Vitamin B12', 'Phosphorus', 'Potassium'],
    'SESAME SEEDS': ['Zinc', 'Copper', 'Manganese'],
    'CHEESE MOZZARELLA': ['Protein', 'Phosphorus', 'Vitamin B12', 'Zinc'],
    'CHIA SEEDS': ['Protein', 'Manganese', 'Phosphorus'],
    'EGG': ['Vitamin B12', 'Selenium', 'Vitamin B2'],
    'BEEF LIVER': ['Vitamin A', 'Copper', 'Vitamin B2'],
    'MUSHROOMS SHIITAKE': ['Copper', 'Vitamin B5', 'Selenium', 'Zinc'],
    'BEEF': ['Iron', 'Zinc', 'Vitamin B12'],
    'LENTILS': ['Iron', 'Manganese', 'Protein'],
    'FLAXSEED': ['Magnesium', 'Phosphorus'],
    'CHICKPEAS': ['Iron', 'Phosphorus', 'Manganese'],
    'OATS': ['Manganese', 'Phosphorus', 'Magnesium', 'Zinc'],
    'PUMPKIN SEEDS': ['Zinc', 'Magnesium', 'Iron'],
    'ALMONDS': ['Vitamin E', 'Magnesium', 'Manganese', 'Protein'],
    'WALNUTS': ['Copper', 'Manganese'],
    'BANANAS': ['Potassium', 'Vitamin B6', 'Vitamin C', 'Magnesium'],
    'CHICKEN': ['Selenium', 'Vitamin B6', 'Phosphorus'],
    'CARROT': ['Vitamin A', 'Vitamin K', 'Potassium'],
    'SWEET POTATO': ['Vitamin A', 'Vitamin C', 'Manganese', 'Potassium'],
    'SPINACH': ['Iron', 'Vitamin K', 'Vitamin A'],
    'BROCCOLI': ['Vitamin C', 'Vitamin K', 'Potassium']
}

# 3. Add new food items with nutrients only from allowed list
new_foods = [
    {'Id': 11959, 'Food_Item': 'OKRA', 'Nutrient': 'Fiber, Vitamin K, Vitamin C, Magnesium'},
    {'Id': 11252, 'Food_Item': 'YOGURT', 'Nutrient': 'Calcium, Protein, Vitamin B12, Phosphorus'},
    {'Id': 11507, 'Food_Item': 'POTATOES', 'Nutrient': 'Potassium, Vitamin C, Vitamin B6, Fiber, Manganese'}
]

# Add new foods to the dataframe
new_foods_df = pd.DataFrame(new_foods)
normalized_df = pd.concat([normalized_df, new_foods_df], ignore_index=True)

# Apply additional nutrients to existing foods (only from allowed list)
for index, row in normalized_df.iterrows():
    food = row['Food_Item'].strip()
    if food in additional_nutrients:
        current_nutrients = set(row['Nutrient'].split(', '))
        # Filter new nutrients to only include allowed ones
        new_nutrients_to_add = [nutrient for nutrient in additional_nutrients[food] if nutrient in allowed_nutrients]
        new_nutrients = current_nutrients.union(set(new_nutrients_to_add))
        normalized_df.at[index, 'Nutrient'] = ', '.join(sorted(new_nutrients))

# Clean up the data
normalized_df['Food_Item'] = normalized_df['Food_Item'].str.strip()
normalized_df = normalized_df.sort_values('Food_Item')

# Save the normalized dataset
normalized_df.to_csv('normalized_nutrient_recommendations.csv', index=False)

print("Dataset normalized and enhanced successfully!")
print(f"Total unique food items: {len(normalized_df)}")
print(f"Allowed nutrients: {len(allowed_nutrients)}")
print("\nSample of the normalized data:")
print(normalized_df.head(10))