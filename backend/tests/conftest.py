import os
import sys
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.main import app
from src.database import Base, get_db
from src.dependencies import get_current_user, get_admin_user, get_db

from src.models import User, Character, ExerciseDifficulty, ActiveEffect, CharacterClass, AbilityType, CharacterAbility

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_size=10, max_overflow=50
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

def override_current_user():
    user = User(
        id=1,
        username="testuser",
        email="test@test.com",
        password_hash="x",
        created_at=datetime.utcnow(),
        is_admin=False
    )

    character = Character(
        id=1,
        user_id=1,
        name="Hero",
        class_=CharacterClass.Barbarian,
        level=1,
        xp=0,
        ability_points=0,
        quest_difficulty=ExerciseDifficulty.VeryEasy,
    )

    character.abilities = [
        CharacterAbility(ability=AbilityType.STR, score=10),
        CharacterAbility(ability=AbilityType.DEX, score=10),
        CharacterAbility(ability=AbilityType.CON, score=10),
        CharacterAbility(ability=AbilityType.INT, score=10),
        CharacterAbility(ability=AbilityType.WIS, score=10),
        CharacterAbility(ability=AbilityType.CHA, score=10),
    ]

    character.active_effects = []

    user.characters = [character]

    return user

app.dependency_overrides[get_current_user] = override_current_user

def override_get_admin_user():
    return User(id=2, username="adminuser", email="admin@test.com", password_hash="x")

app.dependency_overrides[get_admin_user] = override_get_admin_user

client = TestClient(app)
