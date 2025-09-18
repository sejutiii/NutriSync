from pydantic import BaseModel, Field, root_validator
from typing import Dict, Any
from datetime import datetime

# List of allowed nutrients from nutrition_analysis.json
ALLOWED_NUTRIENTS = [
    "Carbohydrates", "Cholesterol", "Choline", "Fiber", "Manganese", "Vitamin B3", "Vitamin B5", "Protein",
    "Vitamin B2", "Selenium", "Sugar", "Vitamin B1", "Fats", "Calcium", "Copper", "Iron", "Magnesium",
    "Phosphorus", "Potassium", "Sodium", "Zinc", "Vitamin A", "Vitamin B12", "Vitamin B6", "Vitamin C",
    "Vitamin E", "Vitamin K"
]

class UserNutrition(BaseModel):
    user_id: str = Field(..., description="User's unique identifier")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of nutrition record")
    nutrients: Dict[str, Any] = Field(..., description="Nutrient values from nutrition_analysis.json")

    @root_validator(pre=True)
    def filter_nutrients(cls, values):
        nutrients = values.get('nutrients', {})
        # Only keep allowed nutrients
        filtered = {k: v for k, v in nutrients.items() if k in ALLOWED_NUTRIENTS}
        values['nutrients'] = filtered
        return values
