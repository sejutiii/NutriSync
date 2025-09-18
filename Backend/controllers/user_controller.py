from fastapi import Depends, HTTPException, Request
from jose import jwt, JWTError
import os
from models.user import User, UserCreate
from db import db
from bson import ObjectId

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret")
ALGORITHM = "HS256"

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db["user"].find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user["_id"] = str(user["_id"])
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def update_user_info(updated: dict, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    # Don't allow email or password change here for simplicity
    updated.pop("email", None)
    updated.pop("password", None)
    result = await db["user"].update_one({"_id": ObjectId(user_id)}, {"$set": updated})
    if result.modified_count:
        user = await db["user"].find_one({"_id": ObjectId(user_id)})
        user["_id"] = str(user["_id"])
        return user
    else:
        raise HTTPException(status_code=400, detail="No changes made")
from fastapi import HTTPException

async def get_all_users():
    users_cursor = db["user"].find()
    users = []
    async for user in users_cursor:
        user["_id"] = str(user["_id"])
        users.append(user)
    return users

async def create_user(user: UserCreate):
    # Check for unique email
    existing = await db["user"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    user_dict = user.dict(exclude_unset=True)
    user_dict["password"] = pwd_context.hash(user_dict["password"])
    print("Using database:", db.name)
    print("Inserting into collection: user")
    result = await db["user"].insert_one(user_dict)
    print(f"Inserted user with _id: {result.inserted_id}")
    user_dict["_id"] = str(result.inserted_id)
    return User(**user_dict)

async def delete_all_users():
    result = await db["user"].delete_many({})
    return {"deleted_count": result.deleted_count}

async def get_user(email: str):
    user = await db["user"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return User(**user)

async def get_user_by_email(email: str):
    user = await db["user"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return User(**user)
