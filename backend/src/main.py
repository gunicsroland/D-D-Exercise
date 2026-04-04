from datetime import datetime, timezone
from pathlib import Path
import os
import markdown

from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from src.database import Base, engine
import src.schemas as schemas
from src.models import User, ActiveEffect
from src.dependencies import get_current_user, get_db

from src.constants import ORIGINS

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


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
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
            ActiveEffect.character_id == current_user.characters[0].id,
            ActiveEffect.expires_at > datetime.now(timezone.utc),
        )
        .all()
    )
    return own_effects


@app.get("/me", response_model=schemas.UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/", response_class=HTMLResponse)
def read_md():

    notes = Path("/app/bip.md")

    with open(notes, "r", encoding="utf-8") as f:
        md_content = f.read()

    html = markdown.markdown(md_content)

    return f"""
    <html>
        <head>
            <title>Markdown Page</title>
        </head>
        <body>
            {html}
        </body>
    </html>
    """

