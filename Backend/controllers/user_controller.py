from fastapi import HTTPException
from models.user import User, UserCreate
from db import db
from bson import ObjectId

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
    user_dict = user.dict(exclude_unset=True)
    print("Using database:", db.name)
    print("Inserting into collection: user")
    result = await db["user"].insert_one(user_dict)
    print(f"Inserted user with _id: {result.inserted_id}")
    user_dict["_id"] = str(result.inserted_id)
    return User(**user_dict)

async def delete_all_users():
    result = await db["user"].delete_many({})
    return {"deleted_count": result.deleted_count}

async def get_user(user_id: str):
    user = await db["user"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return User(**user)
