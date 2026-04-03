import pytest
from fastapi import status

from tests.conftest import client, TestingSessionLocal
from src.models import (
    User,
    Character,
    CharacterClass,
    Quest,
    Exercise,
    Item,
    CharQuestProgress,
    ExerciseCategory,
    ExerciseDifficulty,
    ItemType,
)

# -------------------------
# Helpers
# -------------------------

def create_exercise(db):
    exercise = Exercise(
        name="Pushups",
        category=ExerciseCategory.Strength,
        difficulty=ExerciseDifficulty.Easy,
        xp_reward=10,
        quantity=10,
    )
    db.add(exercise)
    db.commit()
    db.refresh(exercise)
    return exercise


def create_item(db):
    item = Item(
        name="Sword",
        description="A weapon",
        item_type=ItemType.Weapon,
        image_url="",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def create_quest(db, exercise_id, item_id=None):
    quest = Quest(
        name="Daily Pushups",
        exercise_id=exercise_id,
        amount=10,
        xp_reward=50,
        item_reward=item_id,
    )
    db.add(quest)
    db.commit()
    db.refresh(quest)
    return quest

def create_character(db, user):
    character = Character(
        user_id=user.id,
        name="Hero",
        class_=CharacterClass.Barbarian,
    )
    db.add(character)
    db.commit()
    db.refresh(character)
    return character

# -------------------------
# Tests
# -------------------------

def test_get_all_quests():
    db = TestingSessionLocal()
    exercise = create_exercise(db)
    quest = create_quest(db, exercise.id)

    response = client.get("/quests/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


def test_get_quest_success():
    db = TestingSessionLocal()
    exercise = create_exercise(db)
    quest = create_quest(db, exercise.id)

    response = client.get(f"/quests/{quest.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == quest.id
    assert data["name"] == quest.name


def test_get_quest_not_found():
    response = client.get("/quests/999999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Quest not found"


def test_create_quest():
    db = TestingSessionLocal()
    exercise = create_exercise(db)
    item = create_item(db)

    payload = {
        "name": "New Quest",
        "exercise_id": exercise.id,
        "amount": 5,
        "xp_reward": 20,
        "item_reward": item.id,
    }

    response = client.post("/quests/", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Quest"


def test_create_quest_exercise_not_found():
    payload = {
        "name": "Invalid Quest",
        "exercise_id": 999999,
        "amount": 5,
        "xp_reward": 20,
    }

    response = client.post("/quests/", json=payload)

    assert response.status_code == 404
    assert response.json()["detail"] == "Exercise not found"


def test_create_quest_item_not_found():
    db = TestingSessionLocal()
    exercise = create_exercise(db)

    payload = {
        "name": "Quest",
        "exercise_id": exercise.id,
        "amount": 5,
        "xp_reward": 20,
        "item_reward": 999999,
    }

    response = client.post("/quests/", json=payload)

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"


def test_update_quest():
    db = TestingSessionLocal()
    exercise = create_exercise(db)
    quest = create_quest(db, exercise.id)

    payload = {
        "name": "Updated Quest"
    }

    response = client.put(f"/quests/{quest.id}", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Quest"


def test_update_quest_not_found():
    response = client.put("/quests/999999", json={"name": "X"})

    assert response.status_code == 404
    assert response.json()["detail"] == "Quest not found"


def test_delete_quest():
    db = TestingSessionLocal()
    exercise = create_exercise(db)
    quest = create_quest(db, exercise.id)

    response = client.delete(f"/quests/{quest.id}")

    assert response.status_code == 200
    assert response.json()["detail"] == "Quest deleted successfully"

    db.close()


def test_get_user_quest_progress():
    db = TestingSessionLocal()

    user = User(
        username="progress_user",
        email="progress@test.com",
        password_hash="x",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    character = create_character(db, user)

    exercise = create_exercise(db)
    quest = create_quest(db, exercise.id)

    progress = CharQuestProgress(
        char_id=character.id,
        quest_id=quest.id,
        progress=5,
        completed=False,
    )
    db.add(progress)
    db.commit()

    response = client.get("/quests/quest_progress")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
