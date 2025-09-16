from fastapi import HTTPException
from models.user import UserLogin
from db import db

async def login_user(login: UserLogin):
    user = await db["user"].find_one({"email": login.email})
    if not user or user.get("password") != login.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user_id": str(user["_id"])}
