import pandas as pd

# Load the original CSV into a DataFrame for future processing
df = pd.read_csv('food.csv')

# Select the required columns: first two columns, 'Data.Household Weights.1st Household Weight', and 'Description'
selected_columns = [
	df.columns[0],
	df.columns[1],
	'Data.Household Weights.1st Household Weight',
	'Description'
]
df_selected = df[selected_columns]

# Save the selected columns to a new CSV file
df_selected.to_csv('food_selected.csv', index=False)