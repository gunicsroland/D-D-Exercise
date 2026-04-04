import pytest
from src.dependencies import get_current_user
from src.models import User, Character, AbilityType
from tests.conftest import client



def test_user_has_character_false():
    response = client.get("/character/has_character/")
    assert response.status_code == 200
    assert response.json() == {"has_character": False}


def test_get_character_not_found():

    response = client.get("/character/me")

    assert response.status_code == 404
    assert response.json()["detail"] == "Character not found"


def test_create_character():

    data = {
        "name": "Hero",
        "class_": "Bard",
        "abilities": {
            "strength": 10,
            "dexterity": 10,
            "constitution": 10,
            "intelligence": 10,
            "wisdom": 10,
            "charisma": 10,
        },
    }

    response = client.post("/character/", json=data)

    assert response.status_code == 200
    assert response.json()["message"] == "Character created successfully"


def test_user_has_character_true():

    data = {
        "name": "Hero",
        "class_": "Bard",
        "abilities": {
            "strength": 10,
            "dexterity": 10,
            "constitution": 10,
            "intelligence": 10,
            "wisdom": 10,
            "charisma": 10,
        },
    }

    client.post("/character/", json=data)

    response = client.get("/character/has_character/")
    assert response.json()["has_character"] is True


def test_get_character_success():

    data = {
        "name": "Hero",
        "class_": "Bard",
        "abilities": {
            "strength": 10,
            "dexterity": 10,
            "constitution": 10,
            "intelligence": 10,
            "wisdom": 10,
            "charisma": 10,
        },
    }

    client.post("/character/", json=data)

    response = client.get("/character/me")

    assert response.status_code == 200
    assert response.json()["name"] == "Hero"


def test_delete_character():

    data = {
        "name": "Hero",
        "class_": "Bard",
        "abilities": {
            "strength": 10,
            "dexterity": 10,
            "constitution": 10,
            "intelligence": 10,
            "wisdom": 10,
            "charisma": 10,
        },
    }

    client.post("/character/", json=data)

    response = client.delete("/character/")

    assert response.status_code == 200
    assert response.json()["message"] == "Character deleted successfully"