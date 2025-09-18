from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal

# Request schema (no _id)
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: int
    height: float
    weight: float
    gender: Literal["M", "F"]
    lifestyle: Literal[
        "Sedentary",
        "Lightly active",
        "Moderately active",
        "Very active",
        "Extra active"
    ] = "Moderately active"

# Login request schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Response schema (includes _id)
class User(BaseModel):
    id: Optional[str] = Field(None, alias="_id")  # MongoDB ObjectId as string
    name: str
    email: EmailStr
    password: str
    age: int
    height: float
    weight: float
    gender: Literal["M", "F"]
    lifestyle: Literal[
        "Sedentary",
        "Lightly active",
        "Moderately active",
        "Very active",
        "Extra active"
    ] = "Moderately active"

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            # Add custom encoders if needed
        }
