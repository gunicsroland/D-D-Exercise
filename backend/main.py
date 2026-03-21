from routes import characters, inventories
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from database import Base, engine
import schemas
from models import User, ActiveEffect
from dependencies import get_current_user, get_db

from routes import auth, users, items, effects, exercises, quests, adventures, messages

app = FastAPI()

app.include_router(auth.app)
app.include_router(users.app)
app.include_router(characters.app)
app.include_router(inventories.app)
app.include_router(items.app)
app.include_router(effects.app)
app.include_router(exercises.app)
app.include_router(quests.app)
app.include_router(adventures.app)
app.include_router(messages.app)

Base.metadata.create_all(bind=engine)

origins = [
    "http://16.171.52.203:8081",
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],         
)

@app.get("/me/effects", response_model=list[schemas.ActiveEffectRead])
def get_active_effects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)):
    print(current_user)

    effects = db.query(ActiveEffect).filter(
        ActiveEffect.user_id == current_user.id,
        ActiveEffect.expires_at > datetime.now(timezone.utc)
    ).all()
    return effects

@app.get("/me")
def get_me(current_user: User = Depends(get_current_user), response_model=schemas.UserRead):
    return current_user