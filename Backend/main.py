from fastapi import FastAPI
from dotenv import load_dotenv
import os

from routes.user_routes import router as user_router
from db import db
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    secret_key = os.getenv("SECRET_KEY")
    collections = await db.list_collection_names()
    return {
        "message": "Hello, NutriSync!",
        "secret_key": secret_key,
        "collections": collections
    }

@app.get("/db-status")
async def db_status():
    try:
        result = await db.command("ping")
        if result.get("ok"):
            return {"status": "connected"}
        else:
            return {"status": "not connected"}
    except Exception as e:
        return {"status": "error", "details": str(e)}

app.include_router(user_router)
