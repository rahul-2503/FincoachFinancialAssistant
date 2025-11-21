# backend/db.py
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# ✅ Force load .env from backend folder regardless of where uvicorn is run
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(f"DATABASE_URL not set or empty. Could not load .env at: {env_path}")

from .models import Transaction  # import after loading env vars

async def init_db():
    client = AsyncIOMotorClient(DATABASE_URL)
    await init_beanie(database=client.get_default_database(), document_models=[Transaction])
