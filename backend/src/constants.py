import os

XP_LEVELS = {
    1: 0,
    2: 300,
    3: 900,
    4: 2700,
    5: 6500,
    6: 14000,
    7: 23000,
    8: 34000,
    9: 48000,
    10: 64000,
    11: 85000,
    12: 100000,
    13: 120000,
    14: 140000,
    15: 165000,
    16: 195000,
    17: 225000,
    18: 265000,
    19: 305000,
    20: 355000,
}
MAX_LEVEL = 20

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "supersecret")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret123456")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.5-flash")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
SUMMARY_TRIGGER_MESSAGES = 20
RECENT_MESSAGES_TO_KEEP = 12

DAILY_QUEST_COUNT = 3
