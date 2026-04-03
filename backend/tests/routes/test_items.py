import pytest
from fastapi import status

from src.models import Item, ItemType, ItemEffect, AbilityType
from tests.conftest import client, TestingSessionLocal
from src.dependencies import get_admin_user


# -------------------------
# Helpers
# -------------------------

def create_item(db, name="Sword"):
    item = Item(
        name=name,
        description="Test item",
        item_type=ItemType.Weapon,
        image_url="",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def create_effect(db):
    effect = ItemEffect(
        attribute=AbilityType.STR,
        increase=True,
        value=5,
        duration=10,
    )
    db.add(effect)
    db.commit()
    db.refresh(effect)
    return effect


# -------------------------
# Tests
# -------------------------

def test_get_all_items():
    db = TestingSessionLocal()
    create_item(db)

    response = client.get("/items/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


def test_get_item_success():
    db = TestingSessionLocal()
    item = create_item(db)

    response = client.get(f"/items/{item.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == item.id
    assert data["name"] == item.name


def test_get_item_not_found():
    response = client.get("/items/999999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"


def test_create_item():
    payload = {
        "name": "Shield",
        "description": "Defensive item",
        "item_type": "armor",
        "image_url": "",
    }

    response = client.post("/items/", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Shield"
    assert data["item_type"] == "armor"


def test_update_item():
    db = TestingSessionLocal()
    item = create_item(db)

    payload = {
        "name": "Updated Name"
    }

    response = client.put(f"/items/{item.id}", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"


def test_update_item_not_found():
    response = client.put("/items/999999", json={"name": "X"})

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"


def test_delete_item():
    db = TestingSessionLocal()
    item = create_item(db)

    response = client.delete(f"/items/{item.id}")

    assert response.status_code == 200
    assert response.json()["detail"] == "Item deleted successfully"


def test_delete_item_not_found():
    response = client.delete("/items/999999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"


def test_link_effect_to_item():
    db = TestingSessionLocal()
    item = create_item(db)
    effect = create_effect(db)

    response = client.post(f"/items/{item.id}/effects/{effect.id}")

    assert response.status_code == 200


def test_unlink_effect_success():
    db = TestingSessionLocal()

    item = create_item(db)
    effect = create_effect(db)

    # Link first
    item.effects.append(effect)
    db.commit()

    response = client.delete(f"/items/{item.id}/effects/{effect.id}")

    assert response.status_code == 200
    assert response.json()["detail"] == "Effect unlinked from item successfully"


def test_unlink_effect_not_linked():
    db = TestingSessionLocal()

    item = create_item(db)
    effect = create_effect(db)

    response = client.delete(f"/items/{item.id}/effects/{effect.id}")

    assert response.status_code == 400
    assert response.json()["detail"] == "Effect is not linked to this item"


def test_unlink_item_not_found():
    db = TestingSessionLocal()
    effect = create_effect(db)

    response = client.delete(f"/items/999999/effects/{effect.id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"


def test_unlink_effect_not_found():
    db = TestingSessionLocal()
    item = create_item(db)

    response = client.delete(f"/items/{item.id}/effects/999999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item effect not found"