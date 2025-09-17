from fastapi import HTTPException, Response
from fastapi.responses import JSONResponse
from models.user import UserLogin
from db import db
from passlib.context import CryptContext
from jose import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def login_user(login: UserLogin):
    user = await db["user"].find_one({"email": login.email})
    if not user or not verify_password(login.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token({"user_id": str(user["_id"])})
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=60*60,  # 1 hour
        expires=60*60,
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )
    return response
    return response
