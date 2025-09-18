import json
from fastapi import HTTPException
from db import db

async def analyze_calories(email: str):
    try:
        # Fetch user info from DB
        user = await db["user"].find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        # Extract user info
        gender = user.get("gender")
        age = user.get("age")
        height = user.get("height")
        weight = user.get("weight")
        lifestyle = user.get("lifestyle", "Moderately active")

        # Calculate BMR (Mifflin-St Jeor)
        if gender == "M":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

        activity_factors = {
            "Sedentary": 1.2,
            "Lightly active": 1.375,
            "Moderately active": 1.55,
            "Very active": 1.725,
            "Extra active": 1.9
        }
        daily_calories = round(bmr * activity_factors.get(lifestyle, 1.55), 2)

        # Get actual intake from output.json
        try:
            with open("output.json", "r", encoding="utf-8") as f:
                output = json.load(f)
            intake = output.get("Data.Kilocalories", 0)
        except Exception:
            intake = 0

        # Compare and prepare result
        if intake < daily_calories:
            status = "Below requirement"
        elif intake > daily_calories:
            status = "Above requirement"
        else:
            status = "Meets requirement"

        return {
            "email": email,
            "required_calories": daily_calories,
            "actual_intake": intake,
            "status": status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))