import nltk
import pandas as pd
import re
import json
from difflib import get_close_matches
from datetime import datetime
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string

# Download required NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

class NutritionParser:
    def __init__(self, csv_file_path):
        """Initialize the nutrition parser with the food dataset."""
        # Load CSV and handle potential NaN values
        self.df = pd.read_csv(csv_file_path)
        # Fill NaN in Description with empty string and convert to string
        self.df['Description'] = self.df['Description'].fillna('').astype(str)
        self.stop_words = set(stopwords.words('english'))
        
        # Bangladeshi food translation dictionary
        self.bangla_food_mapping = {
            'bhat': 'rice', 'vat': 'rice', 'vaat': 'rice',
            'khichuri': 'rice lentil', 'khichdi': 'rice lentil',
            'alu': 'potato', 'aloo': 'potato',
            'murgi': 'chicken',
            'goru': 'beef', 'gorur': 'beef',
            'shobji': 'vegetable', 'sobji': 'vegetable',
            'mach': 'fish', 'maach': 'fish',
            'daal': 'lentil', 'dal': 'lentil', 'dhal': 'lentil',
            'dim': 'egg',
            'polao': 'rice oil', 'pulao': 'rice oil',
            'roti': 'bread', 'chapati': 'bread',
            'pani': 'water', 'paani': 'water',
            'dudh': 'milk', 'doodh': 'milk',
            'chini': 'sugar', 'cheeni': 'sugar',
            'tel': 'oil', 'teel': 'oil',
            'bhuna': 'fried', 'bhaja': 'fried',
            'tarkari': 'gravy', 'curry': 'curry'
        }
        
        # Common quantity patterns
        self.quantity_patterns = {
            r'(\d+(?:\.\d+)?)\s*cups?': ('cup', 1.0),
            r'(\d+(?:\.\d+)?)\s*tbsp|tablespoons?': ('tablespoon', 1.0),
            r'(\d+(?:\.\d+)?)\s*tsp|teaspoons?': ('teaspoon', 1.0),
            r'(\d+(?:\.\d+)?)\s*oz|ounces?': ('oz', 1.0),
            r'(\d+(?:\.\d+)?)\s*lbs?|pounds?': ('pound', 1.0),
            r'(\d+(?:\.\d+)?)\s*g|grams?': ('gram', 1.0),
            r'(\d+(?:\.\d+)?)\s*kg|kilograms?': ('kilogram', 1000.0),
            r'(\d+(?:\.\d+)?)\s*pieces?|pcs?': ('piece', 1.0),
            r'(\d+(?:\.\d+)?)\s*slices?': ('slice', 1.0),
            r'(\d+(?:\.\d+)?)\s*bowls?': ('bowl', 1.0),
            r'(\d+(?:\.\d+)?)\s*plates?': ('plate', 1.0),
            r'some|little|bit': ('some', 1.0),
        }
    
    def preprocess_text(self, text):
        """Preprocess and clean the input text."""
        text = text.lower()
        # Apply Bangla to English mapping
        for bangla_word, english_word in self.bangla_food_mapping.items():
            text = re.sub(r'\b' + bangla_word + r'\b', english_word, text)
        # Clean special characters but keep spaces and dots
        text = re.sub(r'[^\w\s\.]', ' ', text)
        return text
    
    def extract_food_items(self, text):
        """Extract food items and their quantities from slash-separated text."""
        # Split by slash first
        items = text.split('/')
        food_items = []
        
        for item in items:
            item = item.strip()
            if not item:
                continue
                
            # Preprocess the individual item
            processed_item = self.preprocess_text(item)
            
            # Extract quantity information
            quantity_info = self.extract_quantity(processed_item)
            
            # Remove quantity patterns from the food description
            food_description = processed_item
            for pattern in self.quantity_patterns.keys():
                food_description = re.sub(pattern, '', food_description, flags=re.IGNORECASE)
            
            # Remove any standalone numbers that weren't caught by quantity patterns
            food_description = re.sub(r'\b\d+(?:\.\d+)?\b', '', food_description)
            
            # Clean up extra whitespace
            food_description = ' '.join(food_description.split())
            
            if food_description:
                food_items.append({
                    'original': item.strip(),
                    'description': food_description,
                    'quantity': quantity_info['amount'],
                    'unit': quantity_info['unit']
                })
        
        return food_items
    
    def extract_quantity(self, phrase):
        """Extract quantity and unit from a phrase."""
        for pattern, (unit, _) in self.quantity_patterns.items():
            match = re.search(pattern, phrase, re.IGNORECASE)
            if match:
                if unit == 'some':
                    return {'amount': 1.0, 'unit': 'serving'}
                else:
                    amount = float(match.group(1)) if match.group(1) else 1.0
                    return {'amount': amount, 'unit': unit}
        
        # If no quantity pattern found, default to 1 serving
        return {'amount': 1.0, 'unit': 'serving'}
    
    def find_best_match(self, food_description):
        """Find the best matching food item in the dataset."""
        tokens = word_tokenize(food_description.lower())
        tokens = [token for token in tokens if token not in self.stop_words and token not in string.punctuation]
        
        best_match = None
        best_score = 0
        
        # First pass: token-based matching
        for idx, row in self.df.iterrows():
            description = row['Description'].lower()
            if not description:
                continue
            
            # Count how many tokens match
            score = sum(1 for token in tokens if token in description)
            if tokens:
                score = score / len(tokens)
            
            if score > best_score:
                best_score = score
                best_match = row
        
        # Second pass: if score is too low, try fuzzy matching
        if best_score < 0.3:
            descriptions = self.df['Description'].tolist()
            matches = get_close_matches(food_description, descriptions, n=1, cutoff=0.3)
            if matches:
                best_match = self.df[self.df['Description'] == matches[0]].iloc[0]
                best_score = 0.5  # Give it a reasonable score
        
        return best_match, best_score
    
    def convert_to_grams(self, amount, unit, food_row):
        """Convert the given amount and unit to grams using household measures."""
        if pd.isna(food_row['Nutrient Data Bank Number']):
            return float(amount)
        
        household_desc = str(food_row['Data.Household Weight Description']).lower()
        household_grams = float(food_row['Data.Household Weights(Gram)'])
        
        # Rule 1: Gram or kilogram
        if unit in ['gram', 'g']:
            return float(amount)
        if unit == 'kilogram':
            return float(amount) * 1000
        
        # Rule 2: Match unit to household description
        if unit in household_desc:
            # Try to extract base amount from household description
            base_match = re.search(r'(\d+(?:\.\d+)?)\s*(\w+)', household_desc)
            if base_match:
                base_amount = float(base_match.group(1))
                base_unit = base_match.group(2).rstrip('s')
                if (base_unit == unit or 
                    (unit == 'oz' and base_unit == 'ounce') or 
                    (unit == 'tsp' and base_unit == 'teaspoon') or
                    (unit == 'tbsp' and base_unit == 'tablespoon')):
                    return (float(amount) / base_amount) * household_grams
            else:
                # No base amount found, assume 1 unit
                return float(amount) * household_grams
        
        # Rule 3: Common conversions for serving-based units
        if unit == 'serving':
            return household_grams * float(amount)
        elif unit in ['bowl', 'plate']:
            # Estimate based on household weight
            return household_grams * float(amount)
        
        # Rule 4: Default to treating amount as grams
        return float(amount)
    
    def parse_input(self, user_input):
        """Parse the user input and return nutrition log data."""
        print(f"Input: {user_input}")
        print("=" * 50)
        
        food_items = self.extract_food_items(user_input)
        log_data = {}
        
        for item in food_items:
            print(f"\nProcessing: {item['original']}")
            print(f"Cleaned description: '{item['description']}'")
            print(f"Quantity: {item['quantity']} {item['unit']}")
            
            match, score = self.find_best_match(item['description'])
            
            if match is not None:
                print(f"Best match: {match['Description']} (score: {score:.2f})")
                
                amount_grams = self.convert_to_grams(
                    item['quantity'], 
                    item['unit'], 
                    match
                )
                
                nutrient_id = str(int(match['Nutrient Data Bank Number']))
                log_data[nutrient_id] = {
                    'amount_gm': round(amount_grams, 1),
                    'description': match['Description'].upper()
                }
                
                print(f"Final: {amount_grams:.1f}g - {match['Description']}")
            else:
                print("No match found")
        
        return log_data
    
    def save_log(self, log_data, filename=None):
        """Save the nutrition log to a JSON file."""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"nutrition_log_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(log_data, f, indent=2)
        
        return filename

# Example usage
# def main():
#     parser = NutritionParser('food_selected.csv')
    
#     # Test with slash-separated input
#     user_input = "2 cups of rice/ chicken curry/ lentil soup/ some almonds/ 2 breads/ jam"
#     print(f"User input: {user_input}")
#     print("\nProcessing...")
#     log_data = parser.parse_input(user_input)
    
#     print("\n" + "=" * 50)
#     print("FINAL NUTRITION LOG:")
#     print(json.dumps(log_data, indent=2))
    
#     # Save the log
#     filename = parser.save_log(log_data)
#     print(f"\nNutrition log saved to: {filename}")
    
#     print("\n" + "=" * 70)
    
#     # Test with Bangla input
#     bangla_input = "2 cup bhat/ murgi curry/ daal/ kichhu alu"
#     print(f"\nBangla input: {bangla_input}")
#     bangla_log = parser.parse_input(bangla_input)
#     print("\n" + "=" * 50)
#     print("BANGLA NUTRITION LOG:")
#     print(json.dumps(bangla_log, indent=2))

# if __name__ == "__main__":
#     main()