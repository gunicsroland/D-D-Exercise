from datetime import datetime, timezone
import os

from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from src.database import Base, engine
import src.schemas as schemas
from src.models import User, ActiveEffect
from src.dependencies import get_current_user, get_db

from src.routes import (
    auth,
    users,
    items,
    effects,
    exercises,
    quests,
    adventures,
    messages,
    characters,
    inventories,
)

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

origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/me/effects", response_model=list[schemas.ActiveEffectRead])
def get_active_effects(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    print(current_user)

    own_effects = (
        db.query(ActiveEffect)
        .filter(
            ActiveEffect.user_id == current_user.id,
            ActiveEffect.expires_at > datetime.now(timezone.utc),
        )
        .all()
    )
    return own_effects


@app.get("/me",  response_model=schemas.UserRead)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user
